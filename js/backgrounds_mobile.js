window.addEventListener('scroll', function() {
    // Get the screen width
    const screenWidth = window.innerWidth;

    // Check if screen width is less than 900px or if it can't be determined
    if (screenWidth > 900) {
        return; // Exit the function and don't run the rest of the script
    }

    const targets = [
        { elementId: 'techies_creed', image: "/images/wave.gif", color: "#003366" },
        { elementId: 'techies_log', image: "/images/log.gif", color: "#692e00" },
    ];

    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY + 400;
    const windowBottom = windowTop + windowHeight;

    let visibleTarget = null;

    // Check visibility of each target element
    targets.forEach(target => {
        const targetElement = document.getElementById(target.elementId);
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            const targetTop = targetRect.top + window.scrollY;
            const targetBottom = targetTop + targetRect.height +400;

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

