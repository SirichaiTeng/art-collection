export default function PromoSection() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: '#93329E' }}
        >
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">🎉 โปรโมชั่นพิเศษ!</h2>
            <p className="text-lg mb-2">
              ซื้อครบ 2,000 บาท รับฟรี Mystery Box มูลค่า 500 บาท
            </p>
            <p className="text-sm opacity-90">
              * เฉพาะสินค้าที่ร่วมรายการเท่านั้น
            </p>
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: '#B4AEE8' }}>
          <div className="text-center text-gray-800">
            <h3 className="text-xl font-semibold mb-2">📢 ข่าวสาร</h3>
            <p className="text-sm">
              คอลเลคชั่นใหม่ "Winter Dream Series" เปิดตัวแล้ว! พร้อมส่วนลดพิเศษ
              15% สำหรับสมาชิกใหม่
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
