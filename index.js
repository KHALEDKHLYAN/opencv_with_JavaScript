// let img_input = document.getElementById("input_image");
// let file_input = document.getElementById("file_input");

// file_input.addEventListener("change", (e) => {
//   img_input.src = URL.createObjectURL(e.target.files[0]);
// }, false);

// img_input.onload = function() {
//   let mat = cv.imread(img_input);
//   cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY);
//   cv.imshow("output", mat);
//   mat.delete();
// }

function onOpenCvReady() {
            // OpenCV.js is ready, initialize face detection
            startFaceDetection();
        }

        function startFaceDetection() {
            // Get video and canvas elements
            let videoElement = document.getElementById('videoElement');
            let canvasElement = document.getElementById('canvasElement');
            let context = canvasElement.getContext('2d');

            // Get access to the camera stream
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    videoElement.srcObject = stream;
                })
                .catch(function (error) {
                    console.log("Error accessing camera:", error);
                });

            // When video metadata is loaded, start face detection
            videoElement.onloadedmetadata = function () {
                // Set canvas size to match video dimensions
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;

                // Create a video capture object using OpenCV
                let cap = new cv.VideoCapture(videoElement);

                // Create a cascade classifier for face detection
                let faceCascade = new cv.CascadeClassifier();
                faceCascade.load('haarcascade_frontalface_default.xml');

                // Start face detection loop
                setInterval(function () {
                    // Read current video frame
                    let frame = new cv.Mat();
                    cap.read(frame);

                    // Convert frame to grayscale
                    let gray = new cv.Mat();
                    cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);

                    // Detect faces in the grayscale frame
                    let faces = new cv.RectVector();
                    faceCascade.detectMultiScale(gray, faces);

                    // Draw rectangles around the detected faces
                    for (let i = 0; i < faces.size(); ++i) {
                        let face = faces.get(i);
                        let point1 = new cv.Point(face.x, face.y);
                        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                        cv.rectangle(frame, point1, point2, [255, 0, 0, 255]);
                    }

                    // Render the frame on the canvas
                    cv.imshow(canvasElement, frame);

                    // Release resources
                    frame.delete();
                    gray.delete();
                    faces.delete();
                }, 1000 / 30); // Run at 30 FPS (adjust as needed)
            };
        }
