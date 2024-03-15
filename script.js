document.addEventListener('DOMContentLoaded', () => {
    // 默认加载主页内容
    loadContent('home'); 

    // 为侧边栏中的每个链接添加点击事件监听器
    document.querySelectorAll('#sidebar nav ul li a').forEach(link => {
        // 排除直接指向文件或外部URL的链接，如CV的PDF文件
        if (!link.href.endsWith('.pdf')) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // 阻止链接的默认行为
                const pageId = link.id; // 获取被点击链接的id
                loadContent(pageId); // 根据id加载相应的内容
            });
        }
    });
});

function loadContent(pageId) {
    let filePath = ''; // 初始化文件路径变量

    // 设置文件路径
    if (pageId === 'projects-overview') {
        filePath = `projects/${pageId}.html`; // 如果点击的是Projects总览
    } else if (pageId.startsWith('project-')) {
        filePath = `projects/${pageId}.html`; // 如果点击的是Projects下的具体项目
    } else if (pageId === 'kitties') {
        filePath = `kitties/${pageId}.html`;
    } else {
        filePath = `${pageId}.html`; // 其他页面
    }

    fetch(filePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 提取 header, main 和 footer
        const header = doc.querySelector('header').outerHTML;
        const main = doc.querySelector('main').outerHTML;
        const footer = doc.querySelector('footer').outerHTML;

        // 更新页面的 header, main 和 footer
        document.querySelector('header').innerHTML = header;
        document.querySelector('main').innerHTML = main;
        document.querySelector('footer').innerHTML = footer;
    })
    .catch(err => {
        console.error('Failed to fetch page: ', err);
        // 错误处理，可以根据需要自定义
        document.getElementById('container').innerHTML = `<p>内容加载失败，请稍后再试。</p>`;
    });
}
