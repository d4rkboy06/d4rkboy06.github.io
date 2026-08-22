var selector = document.querySelector(".selector_box");

if (selector) {
    selector.addEventListener("click", () => {
        if (selector.classList.contains("selector_open")) {
            selector.classList.remove("selector_open");
        } else {
            selector.classList.add("selector_open");
        }
    });
}

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener("click", () => {
        var date = document.querySelector(".date");

        if (date) {
            date.classList.remove("error_shown");
        }
    });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener("click", () => {
        sex = option.id;

        var selectedText = document.querySelector(".selected_text");

        if (selectedText) {
            selectedText.innerHTML = option.innerHTML;
        }
    });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/jpeg,image/png,image/gif";

const CLOUDINARY_CLOUD_NAME = "axpjgxnr";
const CLOUDINARY_UPLOAD_PRESET = "mobywatel1232";

const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/" +
    CLOUDINARY_CLOUD_NAME +
    "/image/upload";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");

    if (input) {
        input.addEventListener("click", () => {
            element.classList.remove("error_shown");
        });
    }
});

if (upload) {
    upload.addEventListener("click", () => {
        imageInput.click();
        upload.classList.remove("error_shown");
    });
}

imageInput.addEventListener("change", async () => {
    var file = imageInput.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif"
    ];

    if (!allowedTypes.includes(file.type)) {
        console.error("Nieprawidłowy typ pliku:", file.type);

        if (upload) {
            upload.classList.add("error_shown");
        }

        alert("Wybierz plik JPG, PNG lub GIF.");
        return;
    }

    if (upload) {
        upload.classList.remove("upload_loaded");
        upload.classList.remove("error_shown");
        upload.classList.add("upload_loading");
        upload.removeAttribute("selected");
    }

    var data = new FormData();

    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        console.log("Wysyłam zdjęcie do Cloudinary...");

        const result = await fetch(
            CLOUDINARY_UPLOAD_URL,
            {
                method: "POST",
                body: data
            }
        );

        let response;

        try {
            response = await result.json();
        } catch (jsonError) {
            throw new Error(
                "Cloudinary zwrócił nieprawidłową odpowiedź."
            );
        }

        console.log(
            "Odpowiedź Cloudinary:",
            response
        );

        if (!result.ok) {
            var errorMessage =
                response &&
                response.error &&
                response.error.message
                    ? response.error.message
                    : "Błąd uploadu HTTP " + result.status;

            throw new Error(errorMessage);
        }

        var url =
            response.secure_url ||
            response.url;

        if (!url) {
            throw new Error(
                "Cloudinary nie zwrócił adresu zdjęcia."
            );
        }

        console.log(
            "Zdjęcie wysłane:",
            url
        );

        if (upload) {
            upload.setAttribute(
                "selected",
                url
            );

            upload.classList.add(
                "upload_loaded"
            );

            upload.classList.remove(
                "upload_loading"
            );

            upload.classList.remove(
                "error_shown"
            );

            var uploadedImage =
                upload.querySelector(
                    ".upload_uploaded"
                );

            if (uploadedImage) {
                uploadedImage.src = url;
            }
        }
    } catch (error) {
        console.error(
            "Błąd wysyłania zdjęcia:",
            error
        );

        if (upload) {
            upload.removeAttribute(
                "selected"
            );

            upload.classList.remove(
                "upload_loading"
            );

            upload.classList.remove(
                "upload_loaded"
            );

            upload.classList.add(
                "error_shown"
            );
        }

        alert(
            "Nie udało się wysłać zdjęcia.\n\n" +
            error.message
        );
    }
});

var goButton = document.querySelector(".go");

if (goButton) {
    goButton.addEventListener("click", () => {
        var empty = [];

        var params = new URLSearchParams();

        params.set(
            "sex",
            sex
        );

        if (
            !upload ||
            !upload.hasAttribute("selected")
        ) {
            if (upload) {
                empty.push(upload);

                upload.classList.add(
                    "error_shown"
                );
            }
        } else {
            params.set(
                "image",
                upload.getAttribute(
                    "selected"
                )
            );
        }

        var birthday = "";

        var dateEmpty = false;

        document
            .querySelectorAll(".date_input")
            .forEach((element) => {
                birthday =
                    birthday +
                    "." +
                    element.value;

                if (
                    isEmpty(
                        element.value
                    )
                ) {
                    dateEmpty = true;
                }
            });

        birthday =
            birthday.substring(1);

        if (dateEmpty) {
            var dateElement =
                document.querySelector(
                    ".date"
                );

            if (dateElement) {
                dateElement.classList.add(
                    "error_shown"
                );

                empty.push(
                    dateElement
                );
            }
        } else {
            params.set(
                "birthday",
                birthday
            );
        }

        document
            .querySelectorAll(
                ".input_holder"
            )
            .forEach((element) => {
                var input =
                    element.querySelector(
                        ".input"
                    );

                if (!input) {
                    return;
                }

                if (
                    isEmpty(
                        input.value
                    )
                ) {
                    empty.push(
                        element
                    );

                    element.classList.add(
                        "error_shown"
                    );
                } else {
                    params.set(
                        input.id,
                        input.value
                    );
                }
            });

        if (
            empty.length !== 0
        ) {
            empty[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } else {
            forwardToId(
                params
            );
        }
    });
}

function isEmpty(value) {
    let pattern = /^\s*$/;

    return pattern.test(
        value
    );
}

function forwardToId(params) {
    location.href =
        "/id?" +
        params.toString();
}

var guide =
    document.querySelector(
        ".guide_holder"
    );

if (guide) {
    guide.addEventListener(
        "click",
        () => {
            if (
                guide.classList.contains(
                    "unfolded"
                )
            ) {
                guide.classList.remove(
                    "unfolded"
                );
            } else {
                guide.classList.add(
                    "unfolded"
                );
            }
        }
    );
}