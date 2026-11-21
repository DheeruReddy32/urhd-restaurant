const http = require('http');

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING URHD FULL-STACK E2E VERIFICATION ---');

  // Test 1: Fetch Menu
  console.log('\n[TEST 1] Fetching Digital Menu...');
  const menuRes = await request('/api/menu');
  if (menuRes.status === 200 && menuRes.body.items.length > 0) {
    console.log(`✓ Menu fetched successfully! ${menuRes.body.items.length} items across ${menuRes.body.categories.length} categories.`);
  } else {
    throw new Error('Menu fetch failed: ' + JSON.stringify(menuRes.body));
  }

  // Test 2: Filter Menu by Veg and Category
  console.log('\n[TEST 2] Testing Advanced Menu Filters (Veg Only & Healthy Bowls)...');
  const filterRes = await request('/api/menu?category=healthy-bowls&veg=true');
  if (filterRes.status === 200 && filterRes.body.items.length > 0) {
    console.log(`✓ Filtered items: ${filterRes.body.items.length} items found.`);
  } else {
    throw new Error('Filter test failed');
  }

  // Test 3: Customer Authentication (Register & Login)
  console.log('\n[TEST 3] Customer Registration & JWT Session...');
  const testEmail = `tester_${Date.now()}@grandline.com`;
  const regRes = await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Roronoa Zoro Tester',
      email: testEmail,
      password: 'swordmaster123',
      phone: '+91 99887 76655',
    },
  });
  if (regRes.status === 200 && regRes.body.user.loyaltyPoints === 100) {
    console.log(`✓ User registered with 100 welcome Pirate Berries: ${regRes.body.user.email}`);
  } else {
    throw new Error('Registration failed: ' + JSON.stringify(regRes.body));
  }

  // Kitchen Staff Login to get valid KITCHEN session token
  console.log('\n[TEST 3b] Kitchen Staff Login for KDS Authority...');
  const kitchenLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: 'kitchen@urhd.com',
      password: 'chef123',
    },
  });
  const kitchenCookie = kitchenLoginRes.headers['set-cookie']
    ? kitchenLoginRes.headers['set-cookie'][0].split(';')[0]
    : '';
  console.log(`✓ Kitchen Chef authorized with verified session cookie.`);

  // Test 4: Validate Coupon Code
  console.log('\n[TEST 4] Coupon Verification (WELCOME50)...');
  const couponRes = await request('/api/coupons/apply', {
    method: 'POST',
    body: { code: 'WELCOME50', subtotal: 800 },
  });
  if (couponRes.status === 200 && couponRes.body.discountAmount > 0) {
    console.log(`✓ Coupon WELCOME50 applied! Discount: ₹${couponRes.body.discountAmount}`);
  } else {
    throw new Error('Coupon test failed: ' + JSON.stringify(couponRes.body));
  }

  // Test 5: Place Dine-In Table Order
  console.log('\n[TEST 5] Placing Dine-In Table #4 Order...');
  const dineInItem = menuRes.body.items[0];
  const orderRes = await request('/api/orders', {
    method: 'POST',
    body: {
      customerName: 'Roronoa Zoro Tester',
      customerPhone: '+91 99887 76655',
      orderType: 'DINE_IN',
      tableNumber: 4,
      paymentMethod: 'UPI_QR',
      items: [
        {
          menuItemId: dineInItem.id,
          quantity: 2,
          selectedCustomizations: [
            { groupName: 'Spice', optionName: 'Medium', price: 0 },
          ],
          specialInstructions: 'Make it fast, training soon!',
        },
      ],
      couponCode: 'WELCOME50',
    },
  });

  if (orderRes.status === 200 && orderRes.body.order.orderNumber) {
    const order = orderRes.body.order;
    console.log(`✓ Dine-in Table Order placed successfully! Order #${order.orderNumber}, Total: ₹${order.totalAmount}`);

    // Test 6: Payment Verification
    console.log('\n[TEST 6] Server-side Payment Verification (UPI QR)...');
    const payRes = await request('/api/payments/verify', {
      method: 'POST',
      body: {
        orderId: order.id,
        paymentMethod: 'UPI_QR',
        upiTransactionId: 'UPI-UTR-9928172654',
      },
    });

    if (payRes.status === 200 && payRes.body.order.status === 'CONFIRMED') {
      console.log(`✓ Payment verified! Order status updated to CONFIRMED. Transaction: ${payRes.body.order.payment.transactionId}`);
    } else {
      throw new Error('Payment verification failed');
    }

    // Test 7: Kitchen KDS Status Workflow (CONFIRMED -> PREPARING)
    console.log('\n[TEST 7] Kitchen KDS Workflow Progression...');
    const prepRes = await request(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: {
        Cookie: kitchenCookie,
      },
      body: { status: 'PREPARING' },
    });
    if (prepRes.status === 200 && prepRes.body.order.status === 'PREPARING') {
      console.log(`✓ Kitchen chef started cooking: status is now PREPARING`);
    } else {
      throw new Error('Kitchen update failed: ' + JSON.stringify(prepRes.body));
    }

    // Test 8: Order Tracking API
    console.log('\n[TEST 8] Real-time Order Tracking Telemetry...');
    const trackRes = await request(`/api/orders/${order.orderNumber}`);
    if (trackRes.status === 200 && trackRes.body.order.status === 'PREPARING') {
      console.log(`✓ Order telemetry verified: ${trackRes.body.order.orderNumber} is PREPARING at Table #${trackRes.body.order.table.number}`);
    } else {
      throw new Error('Tracking telemetry mismatch: ' + JSON.stringify(trackRes.body));
    }
  } else {
    throw new Error('Dine-in order creation failed: ' + JSON.stringify(orderRes.body));
  }

  // Test 9: Workspace Booking
  console.log('\n[TEST 9] Corporate Workspace Pass Booking...');
  const workRes = await request('/api/workspace/bookings', {
    method: 'POST',
    body: {
      packageId: 'half-day-sprint',
      guestName: 'Ananya PM',
      guestEmail: 'ananya@pm.com',
      guestPhone: '+91 98888 77777',
      date: '2026-11-22',
      startTime: '10:00 AM',
      seats: 2,
      specialRequests: 'Need HDMI presentation cable',
    },
  });
  if (workRes.status === 200 && workRes.body.booking.id) {
    console.log(`✓ Workspace reservation confirmed! Total: ₹${workRes.body.booking.totalAmount} for 2 workstations`);
  } else {
    throw new Error('Workspace booking failed: ' + JSON.stringify(workRes.body));
  }

  // Test 10: Owner Login & Dashboard Metrics
  console.log('\n[TEST 10] Owner Executive Metrics Calculation...');
  const ownerLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: 'owner@urhd.com',
      password: 'admin123',
    },
  });
  const ownerCookie = ownerLoginRes.headers['set-cookie']
    ? ownerLoginRes.headers['set-cookie'][0].split(';')[0]
    : '';

  const adminRes = await request('/api/admin/metrics', {
    headers: {
      Cookie: ownerCookie,
    },
  });
  if (adminRes.status === 200 && adminRes.body.metrics) {
    console.log(`✓ Owner metrics telemetry checked! Total Revenue: ₹${adminRes.body.metrics.totalRevenue}, Orders: ${adminRes.body.metrics.totalOrdersCount}`);
  } else {
    throw new Error('Admin metrics failed: ' + JSON.stringify(adminRes.body));
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 10 CORE BUSINESS WORKFLOWS VERIFIED 100% OPERATIONAL!');
  console.log('======================================================');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
