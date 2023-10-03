const body = document.querySelector('body'),
    sidebar = document.querySelector('.sidebar'),
    toggle = document.querySelector('.toggle'),
    searchBtn = document.querySelector('.search-box'),
    modeSwitch = document.querySelector('.toggle-switch'),
    modeText = document.querySelector('.mode-text');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('close');
    });

    searchBtn.addEventListener('click', () => {
        sidebar.classList.remove('close');
    });
    
    modeSwitch.addEventListener('click', () => {
        

        if (body.classList.contains('dark')) {
            modeText.textContent = 'Dark Mode';
            body.classList.remove('dark');
        } else {
            modeText.textContent = 'Light Mode';
            body.classList.add('dark');
        }
    });

var year = new Date().getFullYear();
document.getElementById('date').setAttribute("min", year + "-01-01");
document.getElementById('date').setAttribute("max", year + "-12-31");