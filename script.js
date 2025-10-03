// script.js
// Redirects social icon buttons to their respective URLs

document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = [
        { selector: '.fa-linkedin', url: 'https://www.linkedin.com/in/kavinilavan-a-342502324/' },
        { selector: '.fa-github', url: 'https://github.com/kevin11-afk/' },         
        { selector: '.fa-instagram', url: 'https://www.instagram.com/kavineyy_18' }
    ];

  socialLinks.forEach(link => {
        const icon = document.querySelector(link.selector);
        if (icon && icon.parentElement.tagName === 'A') {
            icon.parentElement.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(link.url, '_blank');
            });
        }
    });

    var controller = new ScrollMagic.Controller();
    new ScrollMagic.Scene({
        duration: document.body.scrollHeight,
        triggerHook: 0
    })
    .setTween("#animated-bg", {y: "50%", ease: "Linear.easeNone"})
    .addTo(controller);
});
