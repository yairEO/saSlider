saSlider - Super Awesome slider
========

### [DEMO PAGE](http://yaireo.github.io/saSlider)


Welcome to saSlider, a slider that I wrote to get a very unique transition effect between slides, while also maintain a super rubust & effective code at minimum lines of code, like always.
This slider could be used for fullscreen effect or any other size and will orient the sliders automatically, so the images will always be centered no matter what.



## HTML markup

    <div class="slider">
        <a class="arrow next"></a>
        <a class="arrow prev"></a>
        <ul>
            <li class="active">
                <img src="" />
            ... <!-- you slide content here -->
            </li>
        </ul>
    </div>

## Javascript

    $('.slider').saSlider(settings);

## plugin settings object

    loop       : true,      // Allows navigation between first and last images
    indicators : true,      // Renderes a UI which shows the number of slides and marks the currently viewed one
    keys       : {
        prev  : '37, 80',   // keycodes to navigate to the previous image, default: Left arrow (37), 'p' (80)
        next  : '39, 78'    // keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
    }