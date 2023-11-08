let progress = document.getElementById('progress');
let song = document.getElementById('audio-player');
let controlIcon = document.getElementById('controlIcon');

document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const musicList = document.querySelector('.music-list');
    const currentSongElement = document.getElementById('current-song'); // Added this line
    const barsIcon = document.querySelector('.fa-bars');
    const backIcon = document.querySelector('.fa-angle-left');
    const imageElement = document.querySelector('.image');
    const musicListElement = document.querySelector('.music-list');
    const goBackward = document.getElementById('goBackward');
    const goForward = document.getElementById('goForward');


    

    barsIcon.addEventListener('click', function() {
        imageElement.style.display = 'none';
        musicListElement.style.display = 'block';
    });
    backIcon.addEventListener('click', function() {
        musicListElement.style.display = 'none';
        imageElement.style.display = 'block';
    });

    const containerName = 'my-music';
    const apiUrl = `https://webmusicplayer.blob.core.windows.net/${containerName}?restype=container&comp=list&Ew95xwNKo7EsImqev%2F8wEfDUl34NdSszEWv%2BVsByv%2FQ%3D`;

    let currentAudioIndex = 0;
    let audioList = [];
    let blobs;
    


    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            blobs = xmlDoc.getElementsByTagName('Blob');

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
                    playAudio(url, blobName);
                });

                audioItem.appendChild(audioLink);
                musicList.appendChild(audioItem);
            }

            // Autoplay the first audio
            playAudio(audioList[currentAudioIndex], blobs[0].getElementsByTagName('Name')[0].textContent); // Updated this line
        })
        .catch(error => {
            console.error('Error fetching music list:', error);
        });

        goBackward.addEventListener('click', function() {
            currentAudioIndex--;
            if (currentAudioIndex < audioList.length) {
                playAudio(audioList[currentAudioIndex], blobs[currentAudioIndex].getElementsByTagName('Name')[0].textContent); // Updated this line
            }
        }); 
        goForward.addEventListener('click', function() {
            currentAudioIndex++;
            if (currentAudioIndex < audioList.length) {
                playAudio(audioList[currentAudioIndex], blobs[currentAudioIndex].getElementsByTagName('Name')[0].textContent);
            }
        });
           

        function playAudio(url, songName) {
            audioPlayer.src = url;
            currentSongElement.textContent = songName;
        
            // Add a check to see if the audio context is unlocked
            if (audioPlayer.readyState >= 2) {
                audioPlayer.play();
            } else {
                document.addEventListener('click', function handleClick() {
                    audioPlayer.play();
                    document.removeEventListener('click', handleClick);
                }, { once: true });
            }
        
            // Set up event listener for when audio ends
            audioPlayer.addEventListener('ended', function() {
                currentAudioIndex++;
                if (currentAudioIndex < audioList.length) {
                    playAudio(audioList[currentAudioIndex], blobs[currentAudioIndex].getElementsByTagName('Name')[0].textContent);
                }
            });
        }
        
    
    
});



song.onloadedmetadata = function () {
    progress.max = song.duration;
    progress.value = song.currentTime;
}
function playPause(){
    if(controlIcon.classList.contains("fa-pause")){
        song.pause();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }
    else{
        song.play();
        controlIcon.classList.remove("fa-play");
        controlIcon.classList.add("fa-pause");
    }
}

if(song.play()){
    setInterval(()=>{
        progress.value = song.currentTime;
    },500)
    // controlIcon.classList.remove("fa-play");
    // controlIcon.classList.add("fa-pause");
}

progress.onchange = function(){
    song.play();
    song.currentTime = progress.value;
    controlIcon.classList.remove("fa-play");
    controlIcon.classList.add("fa-pause");
}
