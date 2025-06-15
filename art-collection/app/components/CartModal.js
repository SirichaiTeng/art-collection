import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from '../redux/productSlice'

export default function CartModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { cart } = useSelector(state => state.products)
  const [deliveryType, setDeliveryType] = useState('pickup')
  const [customerNote, setCustomerNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerIP, setCustomerIP] = useState('')

  // Delivery address form state
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    province: '',
    postalCode: '',
  })

  // Get customer IP
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setCustomerIP(data.ip))
      .catch(() => setCustomerIP('Unknown'))
  }, [])

  // Handle delivery info change
  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validate delivery info
  const validateDeliveryInfo = () => {
    const { name, phone, address, district, province } = deliveryInfo
    return (
      name.trim() &&
      phone.trim() &&
      address.trim() &&
      district.trim() &&
      province.trim()
    )
  }

  // Send Discord notification
  const sendDiscordNotification = async orderData => {
    const DISCORD_WEBHOOK_URL =
      'https://discord.com/api/webhooks/1383715149088686161/rrKnHwWhnaNSQ5SiUG9zyNxZMnOqUca8pSy1KNNKgUGlKV_RcAAxOht7jkdV83EIHVrK'

    const orderTime = new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const itemsList = orderData.items
      .map(
        item =>
          `• ${item.name} x${item.quantity} = ${formatPrice(
            item.price * item.quantity
          )}`
      )
      .join('\n')

    let message = `🛒 **มีออเดอร์ใหม่เข้ามา!**\n\n`
    message += `⏰ **เวลาที่สั่ง:** ${orderTime}\n`
    message += `📦 **รายการสินค้า:**\n${itemsList}\n`
    message += `💰 **ยอดรวม:** ${formatPrice(orderData.total)}\n`
    message += `🚚 **การจัดส่ง:** ${
      orderData.deliveryType === 'delivery' ? 'จัดส่ง' : 'มารับที่ร้าน'
    }\n`

    if (orderData.deliveryType === 'delivery' && orderData.deliveryInfo) {
      message += `\n👤 **ข้อมูลผู้รับ:**\n`
      message += `📝 **ชื่อ-นามสกุล:** ${orderData.deliveryInfo.name}\n`
      message += `📞 **เบอร์โทร:** ${orderData.deliveryInfo.phone}\n`
      message += `🏠 **ที่อยู่:** ${orderData.deliveryInfo.address}\n`
      message += `🏘️ **เขต/อำเภอ:** ${orderData.deliveryInfo.district}\n`
      message += `🌆 **จังหวัด:** ${orderData.deliveryInfo.province}\n`
      if (orderData.deliveryInfo.postalCode) {
        message += `📮 **รหัสไปรษณีย์:** ${orderData.deliveryInfo.postalCode}\n`
      }
      if (orderData.note) {
        message += `📝 **หมายเหตุเพิ่มเติม:** ${orderData.note}\n`
      }
    }

    message += `\n🌐 **IP ลูกค้า:** ${orderData.customerIP}`

    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
      })
      return true
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
      return false
    }
  }

  // Handle order submission
  const handleOrder = async () => {
    if (deliveryType === 'delivery' && !validateDeliveryInfo()) {
      alert('กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน')
      return
    }

    setIsProcessing(true)

    const orderData = {
      items: cart,
      total: getTotalPrice() + (deliveryType === 'delivery' ? 50 : 0),
      deliveryType: deliveryType,
      deliveryInfo: deliveryType === 'delivery' ? deliveryInfo : null,
      note: deliveryType === 'delivery' ? customerNote : '',
      customerIP: customerIP,
      timestamp: new Date().toISOString(),
    }

    // Send to Discord
    const discordSent = await sendDiscordNotification(orderData)

    if (discordSent) {
      alert('สั่งซื้อสำเร็จ! ขอบคุณสำหรับการสั่งซื้อ')
      dispatch(clearCart())
      // Reset form
      setDeliveryInfo({
        name: '',
        phone: '',
        address: '',
        district: '',
        province: '',
        postalCode: '',
      })
      setCustomerNote('')
      setDeliveryType('pickup')
      onClose()
    } else {
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง')
    }

    setIsProcessing(false)
  }

  const formatPrice = price => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateCartQuantity({ id, quantity: newQuantity }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold" style={{ color: '#440A67' }}>
            🛒 ตระกร้าสินค้า ({cart.length} รายการ)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Make it scrollable */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg mb-2">
                ตระกร้าสินค้าว่างเปล่า
              </p>
              <p className="text-gray-400 text-sm">
                เพิ่มสินค้าลงตระกร้าเพื่อเริ่มช้อปปิ้ง
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="max-h-80 overflow-y-auto mb-6 space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg mr-4 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-sm truncate"
                        style={{ color: '#440A67' }}
                      >
                        {item.name}
                      </h4>
                      <p
                        className="font-bold text-lg"
                        style={{ color: '#93329E' }}
                      >
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        รวม: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
                        style={{ borderColor: '#440A67', color: '#440A67' }}
                      >
                        -
                      </button>
                      <span className="mx-3 font-bold text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#440A67' }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Actions */}
              <div className="border-t pt-6 space-y-4">
                {/* Delivery Options */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4
                    className="font-semibold mb-3"
                    style={{ color: '#440A67' }}
                  >
                    🚚 เลือกวิธีการรับสินค้า
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryType === 'pickup'}
                        onChange={e => setDeliveryType(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold">🏪 มารับที่ร้าน</div>
                        <div className="text-sm text-gray-600">
                          ฟรี - รับได้ในวันถัดไป
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        value="delivery"
                        checked={deliveryType === 'delivery'}
                        onChange={e => setDeliveryType(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold">
                          🚚 จัดส่งด่วนถึงที่ !!!
                        </div>
                        <div className="text-sm text-gray-600">
                          ค่าจัดส่งตามระยะทาง
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Delivery Address Form */}
                {deliveryType === 'delivery' && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4
                      className="font-semibold mb-4"
                      style={{ color: '#440A67' }}
                    >
                      📍 ข้อมูลการจัดส่ง
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Name */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: '#440A67' }}
                        >
                          ชื่อ-นามสกุล <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryInfo.name}
                          onChange={e =>
                            handleDeliveryInfoChange('name', e.target.value)
                          }
                          placeholder="กรอกชื่อ-นามสกุล"
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: '#440A67' }}
                        >
                          เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={deliveryInfo.phone}
                          onChange={e =>
                            handleDeliveryInfoChange('phone', e.target.value)
                          }
                          placeholder="กรอกเบอร์โทรศัพท์"
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: '#440A67' }}
                      >
                        ที่อยู่ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={deliveryInfo.address}
                        onChange={e =>
                          handleDeliveryInfoChange('address', e.target.value)
                        }
                        placeholder="กรอกที่อยู่ เช่น บ้านเลขที่ หมู่ ซอย ถนน"
                        className="w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* District */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: '#440A67' }}
                        >
                          เขต/อำเภอ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryInfo.district}
                          onChange={e =>
                            handleDeliveryInfoChange('district', e.target.value)
                          }
                          placeholder="เขต/อำเภอ"
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Province */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: '#440A67' }}
                        >
                          จังหวัด <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryInfo.province}
                          onChange={e =>
                            handleDeliveryInfoChange('province', e.target.value)
                          }
                          placeholder="จังหวัด"
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Postal Code */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: '#440A67' }}
                        >
                          รหัสไปรษณีย์
                        </label>
                        <input
                          type="text"
                          value={deliveryInfo.postalCode}
                          onChange={e =>
                            handleDeliveryInfoChange(
                              'postalCode',
                              e.target.value
                            )
                          }
                          placeholder="รหัสไปรษณีย์"
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: '#440A67' }}
                      >
                        📝 หมายเหตุเพิ่มเติม (จุดสังเกต, ข้อความ):
                      </label>
                      <textarea
                        value={customerNote}
                        onChange={e => setCustomerNote(e.target.value)}
                        placeholder="เช่น อยู่ข้างร้านสะดวกซื้อ, บ้านสีเหลือง, โทรก่อนส่งนะคะ"
                        className="w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>

                    {/* Validation Warning */}
                    {deliveryType === 'delivery' && !validateDeliveryInfo() && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-amber-700 text-sm">
                          ⚠️ กรุณากรอกข้อมูลที่มี{' '}
                          <span className="text-red-500">*</span> ให้ครบถ้วน
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="font-semibold"
                      style={{ color: '#440A67' }}
                    >
                      ยอดรวมสินค้า:
                    </span>
                    <span className="font-bold" style={{ color: '#93329E' }}>
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">ค่าจัดส่ง:</span>
                      <span className="text-sm font-medium">฿50</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xl font-bold"
                        style={{ color: '#440A67' }}
                      >
                        ยอดรวมทั้งสิ้น:
                      </span>
                      <span
                        className="text-3xl font-bold"
                        style={{ color: '#93329E' }}
                      >
                        {formatPrice(
                          getTotalPrice() +
                            (deliveryType === 'delivery' ? 50 : 0)
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    จำนวน{' '}
                    {cart.reduce((total, item) => total + item.quantity, 0)}{' '}
                    ชิ้น
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="flex-1 py-3 px-4 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#440A67', color: '#440A67' }}
                  >
                    ล้างตระกร้า
                  </button>
                  <button
                    onClick={handleOrder}
                    disabled={
                      isProcessing ||
                      (deliveryType === 'delivery' && !validateDeliveryInfo())
                    }
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition-opacity shadow-lg ${
                      isProcessing ||
                      (deliveryType === 'delivery' && !validateDeliveryInfo())
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                    style={{ backgroundColor: '#440A67' }}
                  >
                    {isProcessing ? '⏳ กำลังดำเนินการ...' : '🛒 สั่งซื้อเลย'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
