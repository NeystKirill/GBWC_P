export const renderHeader = (logoPath: string = '/img/own/logo.svg') => {
  return `
    <nav class="nav" id="main-nav">
      <div class="nav-content">
        <div class="logo">
          <img src="${logoPath}" alt="logo">
        </div>
        <ul class="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </nav>
  `;
}