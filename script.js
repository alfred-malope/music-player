document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const musicList = document.querySelector('.music-list');

    const containerName = 'my-music';
    const apiUrl = `https://webmusicplayer.blob.core.windows.net/${containerName}?restype=container&comp=list&Ew95xwNKo7EsImqev%2F8wEfDUl34NdSszEWv%2BVsByv%2FQ%3D`;

    let currentAudioIndex = 0;
    let audioList = [];

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            const blobs = xmlDoc.getElementsByTagName('Blob');

            for (let i = 0; i < blobs.length; i++) {
                const blobName = blobs[i].getElementsByTagName('Name')[0].textContent;
                const url = `https://webmusicplayer.blob.core.windows.net/${containerName}/${blobName}?Ew95xwNKo7EsImqev%2F8wEfDUl34NdSszEWv%2BVsByv%2FQ%3D`;

                audioList.push(url);

                const audioItem = document.createElement('div');
                audioItem.classList.add('audio-item');

                const audioLink = document.createElement('a');
                audioLink.href = url;
                audioLink.textContent = blobName;
                audioLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    playAudio(url);
                });

                audioItem.appendChild(audioLink);
                musicList.appendChild(audioItem);
            }

            // Autoplay the first audio
            playAudio(audioList[currentAudioIndex]);
        })
        .catch(error => {
            console.error('Error fetching music list:', error);
        });

    function playAudio(url) {
        audioPlayer.src = url;
        audioPlayer.play();

        // Set up event listener for when audio ends
        audioPlayer.addEventListener('ended', function() {
            currentAudioIndex++;
            if (currentAudioIndex < audioList.length) {
                playAudio(audioList[currentAudioIndex]);
            }
        });
    }
});
