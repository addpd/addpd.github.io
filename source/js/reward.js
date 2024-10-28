const rewardBtn = document.getElementById('rewardBtn');
const rewardImgContainer = document.getElementById('rewardImgContainer');

if (rewardBtn) {
    rewardBtn.onclick = () => {
        rewardImgContainer.classList.toggle('active');
    }
}