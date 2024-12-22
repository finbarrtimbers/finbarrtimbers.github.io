<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Collection</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Equity Text A", "Times New Roman", serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #fafafa;
            color: #333;
        }

        /* Main content area */
        .content {
            display: flex;
            flex-direction: column;
            gap: 3rem;
            margin-top: 2rem;
        }

        /* Individual video entry */
        .video-entry {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding-bottom: 3rem;
            border-bottom: 1px solid #ddd;
        }

        .video-entry:last-child {
            border-bottom: none;
        }

        /* Video embed container with 16:9 aspect ratio */
        .video-frame {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            background: #eee;
            margin-bottom: 1rem;
        }

        .video-frame iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        /* Typography */
        h1 {
            font-size: 2rem;
            font-weight: normal;
            margin-bottom: 2rem;
            color: #222;
        }

        h2 {
            font-size: 1.2rem;
            font-weight: normal;
            margin-bottom: 0.5rem;
            color: #444;
        }

        p {
            margin-bottom: 1rem;
            font-size: 1rem;
        }

        /* Description styles */
        .description {
            padding-top: 0;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .video-entry {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            body {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <h1>Video Collection</h1>

    <div class="content">
        <div class="video-entry">
            <div class="video-column">
                <div class="video-frame">
                    <!-- Replace src with your video embed URL -->
                    <img src="/api/placeholder/560/315" alt="placeholder">
                </div>
                <h2>Video Title 1</h2>
            </div>
            <div class="description">
                <p>This is a detailed description of the first video. It explains the content and context of the video, providing viewers with necessary background information and key points to look out for.</p>
            </div>
        </div>

        <div class="video-entry">
            <div class="video-column">
                <div class="video-frame">
                    <img src="/api/placeholder/560/315" alt="placeholder">
                </div>
                <h2>Video Title 2</h2>
            </div>
            <div class="description">
                <p>This is a description of the second video. It provides context and explanation for the content, highlighting important aspects and relevant details that viewers should know about.</p>
            </div>
        </div>
    </div>
</body>
</html>