#!/bin/bash

echo "=== Testing Wholesale Inquiries Feature ==="
echo ""

echo "1. Testing API endpoint GET /api/wholesale-inquiries..."
RESPONSE=$(curl -s "http://127.0.0.1:8000/api/wholesale-inquiries")
if echo "$RESPONSE" | python -m json.tool > /dev/null 2>&1; then
    echo "   ✓ API returns valid JSON"
    INQUIRY_ID=$(echo "$RESPONSE" | python -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if data else 'NO_DATA')" 2>/dev/null)
    if [ "$INQUIRY_ID" != "NO_DATA" ]; then
        echo "   ✓ Found wholesale inquiry with ID: $INQUIRY_ID"
    else
        echo "   ✗ No wholesale inquiries found in database"
    fi
else
    echo "   ✗ API returns invalid JSON"
fi

echo ""
echo "2. Testing modal structure in admin.blade.php..."
if grep -q "id=\"ws-inquiry-modal\"" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/resources/views/admin.blade.php"; then
    echo "   ✓ Wholesale inquiry modal HTML exists"
else
    echo "   ✗ Modal HTML not found"
fi

echo ""
echo "3. Testing JavaScript functions..."
if grep -q "function openWholesaleInquiryModal" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/resources/views/admin.blade.php"; then
    echo "   ✓ openWholesaleInquiryModal() function exists"
fi
if grep -q "function sendWholesaleInquiryReply" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/resources/views/admin.blade.php"; then
    echo "   ✓ sendWholesaleInquiryReply() function exists"
fi
if grep -q "function deleteWholesaleInquiry" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/resources/views/admin.blade.php"; then
    echo "   ✓ deleteWholesaleInquiry() function exists"
fi
if grep -q "function loadWholesaleInquiries" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/resources/views/admin.blade.php"; then
    echo "   ✓ loadWholesaleInquiries() function exists"
fi

echo ""
echo "4. Testing API endpoints..."
if grep -q "/api/wholesale-inquiries/{id}/reply" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/routes/web.php"; then
    echo "   ✓ POST /api/wholesale-inquiries/{id}/reply route exists"
fi
if grep -q "DELETE /api/wholesale-inquiries/{id}" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/routes/web.php"; then
    echo "   ✓ DELETE /api/wholesale-inquiries/{id} route exists"
fi

echo ""
echo "5. Testing controller methods..."
if grep -q "public function replyToWholesaleInquiry" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/app/Http/Controllers/AdminController.php"; then
    echo "   ✓ replyToWholesaleInquiry() method exists in AdminController"
fi
if grep -q "public function deleteWholesaleInquiry" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/app/Http/Controllers/AdminController.php"; then
    echo "   ✓ deleteWholesaleInquiry() method exists in AdminController"
fi

echo ""
echo "=== All Tests Complete ==="
