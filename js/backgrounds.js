window.addEventListener('scroll', function() {
    const targets = [
        { elementId: 'techies_creed', image: "/images/wave.gif", color: "#003366" },
        { elementId: 'techies_log', image: "/images/log.gif", color: "#692e00" },
    ];

    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY +300;
    const windowBottom = windowTop + windowHeight;

    let visibleTarget = null;

    // Check visibility of each target element
    targets.forEach(target => {
        const targetElement = document.getElementById(target.elementId);
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            const targetTop = targetRect.top + window.scrollY;
            const targetBottom = targetTop + targetRect.height +100;

            // Determine if target is within viewport
            if (targetTop <= windowTop && targetBottom >= windowTop && !visibleTarget) {
                visibleTarget = target;
            }
        }
    });

    // Apply background changes with transition effect
    if (visibleTarget) {
        document.body.style.backgroundImage = `url('${visibleTarget.image}')`;
        document.body.style.backgroundBlendMode = "multiply";
        document.body.style.backgroundColor = visibleTarget.color;
    } else {
        // Reset background to default with transition effect
        document.body.style.backgroundImage = "";
        document.body.style.backgroundColor = "#000000"; // Default color
    }
});

