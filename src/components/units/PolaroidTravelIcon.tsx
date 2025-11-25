// 拍立得風格的旅行圖案 SVG
const PolaroidTravelIcon = () => (
  <svg
    width='80'
    height='80'
    viewBox='0 0 80 80'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='opacity-30'
  >
    {/* 背景圓形 */}
    <circle cx='40' cy='40' r='35' fill='#f59e0b' opacity='0.1' />

    {/* 相機圖案 */}
    <rect
      x='20'
      y='30'
      width='40'
      height='25'
      rx='4'
      fill='#d97706'
      opacity='0.6'
    />
    <circle cx='40' cy='42.5' r='8' fill='#ffffff' opacity='0.8' />
    <circle cx='40' cy='42.5' r='5' fill='#d97706' opacity='0.7' />
    <rect
      x='50'
      y='32'
      width='6'
      height='4'
      rx='1'
      fill='#ffffff'
      opacity='0.8'
    />

    {/* 點點裝飾 */}
    <circle cx='55' cy='25' r='2' fill='#f59e0b' opacity='0.3' />
  </svg>
);

export default PolaroidTravelIcon;
