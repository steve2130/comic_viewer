// For Pages

const next_page_button = document.getElementById("next_page_button");
const previous_page_button = document.getElementById("previous_page_button");
const menu_button = document.getElementById("menu_button");
const image = document.getElementById("image");




        const Body = document.querySelector("body");
        let bg_color = true;

        if (bg_color === true) {
            Body.classList.toggle("Document_background_color");
        }



window.onload = () => {
    TestImageFormatSupport();
    RetrieveReadHistory();
    LayoutToggle();
    FindImages();
}


// Page turning button
    next_page_button.addEventListener("click", () => {
        ToNextImage();
    }, false);

    previous_page_button.addEventListener("click", () => {
        ToPreviousImage();
    }, false);




// Menu Bar
const MenuBar_Wrapper = document.querySelector(".MenuBar_Wrapper");
const MenuBar = document.querySelectorAll(".MenuBar");

const MenuBar_CloseIcon = document.querySelector(".MenuBar_CloseIcon");
const MenuBar_OverflowMenuIcon = document.querySelector(".MenuBar_OverflowMenuIcon");
const MenuBar_MaximizeIcon = document.querySelector(".MenuBar_MaximizeIcon");
const MenuBar_MinimizeIcon = document.querySelector(".MenuBar_MinimizeIcon");

const MenuBar_ClickableMenu_Wrapper = document.querySelector(".MenuBar_ClickableMenu_Wrapper");


    function MenuToggle() {
        MenuBar[0].classList.toggle("MenuBarDisplayed");
        MenuBar[1].classList.toggle("MenuBarDisplayed");

        MenuBar_CloseIcon.classList.toggle("MenuBar_Icon_Displayed");
        MenuBar_OverflowMenuIcon.classList.toggle("MenuBar_Icon_Displayed");
        MenuBar_MaximizeIcon.classList.toggle("MenuBar_Icon_Displayed");

        MenuBar_Wrapper.classList.toggle("display_none");
    }


    menu_button.addEventListener("click", () => {
        MenuToggle();
    }, false);

    MenuBar_Wrapper.addEventListener("click", () => {
        MenuToggle();
    }, false)




    MenuBar_CloseIcon.addEventListener("click", () => {
        window.location.href = "../../../../index.html";
    }, false);


    MenuBar_OverflowMenuIcon.addEventListener("click", () => {
        if (MenuBar[0].classList.contains("MenuBarDisplayed") ) {
           
            MenuBar_ClickableMenu_Wrapper.classList.toggle("MenuBar_ClickableMenu_Wrapper_Expanded");
        }
    }, false);


    // Full screen
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                setTimeout(() => {
                    MenuBar_MaximizeIcon.classList.toggle("display_none");
                    MenuBar_MaximizeIcon.classList.toggle("MenuBar_Icon_Displayed");
                    MenuBar_MinimizeIcon.classList.toggle("display_none");
                    MenuBar_MinimizeIcon.classList.toggle("MenuBar_Icon_Displayed");
                }, 100);
            }

            else {
                setTimeout(() => {
                    MenuBar_MinimizeIcon.classList.toggle("display_none");
                    MenuBar_MinimizeIcon.classList.toggle("MenuBar_Icon_Displayed");
                    MenuBar_MaximizeIcon.classList.toggle("display_none");
                    MenuBar_MaximizeIcon.classList.toggle("MenuBar_Icon_Displayed");
                }, 100);
            }
        }, false);



        MenuBar_MaximizeIcon.addEventListener("click", () => {
            if (MenuBar_MaximizeIcon.requestFullscreen) {Body.requestFullscreen();}
            else if (MenuBar_MaximizeIcon.webkitRequestFullscreen) {Body.webkitRequestFullscreen();}
            else if (MenuBar_MaximizeIcon.msRequestFullscreen) {Body.msRequestFullscreen();}
        }, false)


        MenuBar_MinimizeIcon.addEventListener("click", () => {
            if (document.exitFullscreen) {document.exitFullscreen();}
            else if (document.webkitExitFullscreen) {document.webkitExitFullscreen();}
            else if (document.msExitFullscreen) {document.msExitFullscreen();}
        }, false);








async function ToNextImage() {
    let returnValues = GetCurrentPageNumber();
    let leadingSourcePath = returnValues[0];
    let currentPage = parseInt(returnValues[1]);

    let imagePreload = preloadImage(leadingSourcePath, currentPage, 3, true);

        imagePreload
            .then( () => {
                console.log("");
            })
            .catch( () => {
                console.log("Something is wrong with preloading image.");
            });

        

    let nextPage = currentPage + 1;
    nextPage = AddLeadingZeros(nextPage);


    let fileExistance = CheckImageExistance(`${leadingSourcePath}/${nextPage}.jpg`);
    
        fileExistance
            .then(() => {
                RecordReadHistory(nextPage);
                image.src = `${leadingSourcePath}/${nextPage}.jpg`;
            })  

            .catch(() => {
                window.location.href = "../../../../index.html";
        });

}



async function ToPreviousImage() {
    let returnValues = GetCurrentPageNumber();
    let leadingSourcePath = returnValues[0];
    let currentPage = parseInt(returnValues[1]);

    let imagePreload = preloadImage(leadingSourcePath, currentPage, 1, false);

    imagePreload
        .then( () => {
            console.log("");
        })
        .catch( () => {
            console.log("Something is wrong with preloading image.");
        });


    let previousPage = currentPage - 1;
    previousPage = AddLeadingZeros(previousPage);


    let fileExistance = CheckImageExistance(`${leadingSourcePath}/${previousPage}.jpg`);

        fileExistance
            .then(() => {
                image.src = `${leadingSourcePath}/${previousPage}.jpg`;
                RecordReadHistory(previousPage);
        })  

            .catch(() => {
                window.location.href = "../../../../index.html";
        });
}







function AddLeadingZeros(PageNumber) {
    PageNumber = PageNumber.toString();
    PageNumber = PageNumber.padStart(3, '0');
    return PageNumber;
}



function GetCurrentPageNumber() {
    let currentSourcePath = image.getAttribute("src");
    let currentSourcePathSplited = currentSourcePath.split("/");

    return [currentSourcePathSplited[0], currentSourcePathSplited[1]];
}



async function CheckImageExistance(SourcePath) {
    return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = SourcePath;

            img.onload = () => resolve(img);
            img.onerror = () => reject();
    })
}



async function preloadImage(sourcePath, currentPage, NumberOfImageToBeLoaded, operator) {
  return new Promise ((resolve, reject) => {
      /*Preload 3 image for now, change it if you want*/

    let image = new Array;
    for (j = 0; j < NumberOfImageToBeLoaded; j++) {
        image[j] = new Image();
    }
    
    
    let nextPage = currentPage;
    for (i = 0; i < NumberOfImageToBeLoaded; i++) {

        if (operator === true) {    // Next page (+)
            currentPage = currentPage + 1;
        }

        else if (operator === false) {    // Previous page (-)
            currentPage = currentPage - 1;
        }

        else {
            console.log("Operator ERROR!");
        }


        nextPage = AddLeadingZeros(currentPage);
        
        image[i].src = `${sourcePath}/${nextPage}.jpg`;
    }


    image.onload = () => resolve();
    image.onerror = () => reject();
    });
}





                // For adding shortcut on turing pages
                // Press keys to turn page
                window.addEventListener("keydown", (event) => {

                    switch (event.key) {

                    case "ArrowRight":
                        ToNextImage();
                        break;

                    case "ArrowLeft":
                        ToPreviousImage();
                        break;



                    case "ArrowUp":
                        ToPreviousImage();
                        break;

                    case "ArrowDown":
                        ToNextImage();
                        break;
                    


                    case "PageUp":
                        ToPreviousImage();
                        break;

                    case "PageDown":
                        ToNextImage();
                        break;
                    }
                }, false);



                // Scroll to turn page
                // Copied from here: https://www.sitepoint.com/html5-javascript-mouse-wheel/

                if (window.addEventListener) {    // Check whether window have an event listener. 

                    // IE9, Chrome, Safari, Opera
                    window.addEventListener("mousewheel", MouseWheelHandler, false);
                    // Firefox
                    window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
                }

                // IE 6/7/8
                else window.attachEvent("onmousewheel", MouseWheelHandler);
            


                function MouseWheelHandler(e) {

                    // cross-browser wheel delta
                    var e = window.event || e;
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); //???
                    
                    if (delta === -1) {
                        ToNextImage();
                    }

                    else {
                        ToPreviousImage();
                    }

                    return false;
                }


                // Smartphone swipe to turn page
                // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
                // By Damian Pavlica

                // let touchstartX = 0
                // let touchendX = 0

                // function handleGesture() {

                //     if (touchendX < touchstartX) {  // swipe from right to left
                //         ToNextImage();
                //     }

                //     if (touchendX > touchstartX) {  // swipe from left to right
                        
                //         ToPreviousImage();
                //     }
                // }
                
                // document.addEventListener('touchstart', e => {
                //     touchstartX = e.changedTouches[0].screenX
                // });
                
                // document.addEventListener('touchend', e => {
                //     touchendX = e.changedTouches[0].screenX
                //     handleGesture();
                // });



                // Mouse drags to turn page
                //https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
                // By andreyrd

                // let startX = 0;
                // let startY = 0;

                // document.addEventListener("mousedown", e => {
                //     startX = e.pageX;
                //     startY = e.pageY;
                // });

                // document.addEventListener("mouseup", e => {
                //     let diffX = Math.round(e.pageX - startX);   // calc how many pixel were dragged
                //     let diffY = Math.round(e.pageY - startY);

                //     if (diffX > 40) {            // How many pixel dragged to activate this function
                //         ToPreviousImage();
                //     }

                //     else if (diffX < -40) {
                //         ToNextImage();
                //     }
                // })




// Record user reading history

function RecordReadHistory(currentPage) {
    setTimeout(() => {     // Update will be delayed if setTimeout() is not used.
        localStorage.setItem('currentPage', currentPage);
    }, 10);

}


function RetrieveReadHistory() {
    let leadingSourcePath = GetCurrentPageNumber()[0];
    let currentReadingPage = localStorage.getItem('currentPage');

    if (currentReadingPage) {
        image.src = `${leadingSourcePath}/${currentReadingPage}.jpg`;
    }
    else {
        image.src = `${leadingSourcePath}/001.jpg`;
    }
}







function TestImageFormatSupport() {
    let avif = new Image();

    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';

    avif.onload = () => {
        ServeDifferentFormatOfImage(true);
    }

    avif.onerror = () => {
        ServeDifferentFormatOfImage(false);
    }

    setTimeout(() => {
        avif = null;
    }, 2000);   // to free the 1KB memory, be responsible
}


function ServeDifferentFormatOfImage(SupportedFormat) {

    if (SupportedFormat == true) {
        console.log("AVIF supported.");
    }

    else if (SupportedFormat == false) {
        console.log("AVIF not supported.");
    }

    else {
        console.log("AVIF not supported.");
    }

}







const layout_example_wrapper = document.getElementById("layout_example_wrapper");

layout_example_wrapper.addEventListener("click", fun => {
    layout_example_wrapper.classList.add("LayoutExampleWrapper_Animation");
    localStorage.setItem('layoutDisplayed', true);

    setTimeout( () => {
        layout_example_wrapper.style.display = "none";
        layout_example_wrapper.classList.remove("LayoutExampleWrapper_Animation");
    }, 290);
})


// Display the layout

function LayoutToggle() {
    let layoutDisplayed = localStorage.getItem('layoutDisplayed');

    if (layoutDisplayed == "false" || !layoutDisplayed) {   // No boolean for local storage.
        layout_example_wrapper.style.display = "block";
    }

    else {
        layout_example_wrapper.style.display = "none";
    }
}





async function FindImages() {
    for (i = 1; i < 50; i++) {
        fetch(`images/${i.toString().padStart(3, '0')}.jpg`, { method: 'HEAD'})
            .then(res => {
                if (res.ok) {
                    console.log(`${i}`);
                }

            })

    }
    
}


// Check number of images in a volume
// - Backend code
//      > file IO -> easier to code, require DB?

// = Frontend code
//      > Algo -> I will make O(N^2) code, recursive code needed 







