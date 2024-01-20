const chapters = document.querySelector(".chapters");
const searchInput = document.querySelector("#search");
const pageLoader = document.querySelector("#loader");

const displayAllChaptersInfo = (
  id,
  chapterInArabicName,
  chapterInEnglishName,
  englishNameTranslation,
  verses,
  chapterNumber
) => {
  chapters.innerHTML += `
  <div class='chapter-info' data-id="${id}" data-name="${chapterInArabicName}">
    <div class='chapter-names'>
      <a href='' id='chapter-name-en'>
        ${chapterInEnglishName}
      </a>
      <a href='' id='chapter-name-ar'>
        ${chapterInArabicName}
      </a>
    </div>
    <div class='chapter-description' style='margin-top: 45px'>
      <p id='about-chapter'>${englishNameTranslation}</p>
      <p id='total-verses'>
        ${verses.length}
      </p>
    </div>
    <span id='chapter-verse-number'>${chapterNumber}</span>
  </div>`;
};

//search/filter chapters

const filterChapter = (e) => {
  let chapterInfo = document.querySelectorAll(".chapter-info");
  let search = e.target.value.toUpperCase();
  // Iterate over each chapter list
  chapterInfo.forEach((chapter) => {
    let filterChapterNameInEn = chapter
      .querySelector("#chapter-name-en")
      .innerText.toUpperCase();
    let filterChapterNameInAr = chapter
      .querySelector("#chapter-name-ar")
      .innerText.toUpperCase();

    if (
      filterChapterNameInEn.indexOf(search) > -1 ||
      filterChapterNameInAr.indexOf(search) > -1
    ) {
      // If found, display the chapter
      chapter.style.display = "flex";
    } else {
      // If not found, hide the chapter
      chapter.style.display = "none";
    }
  });
};

let currentAudioIndex = 0;
function playAudio(audios) {
  if (currentAudioIndex < audios.length) {
    // Play the current audio
    audios[currentAudioIndex].play();

    // Move to the next audio when the current one ends
    audios[currentAudioIndex].addEventListener("ended", function () {
      currentAudioIndex++;
      playAudio(audios);
    });
  }
}

const getAudio = async (chapterId) => {
  let response = await fetch("http://api.alquran.cloud/v1/quran/ar.alafasy");
  let result = await response.json();
  let versesContainer = document.getElementById("verses-container");
  result.data.surahs[chapterId].ayahs.forEach((verse) => {
    versesContainer.innerHTML += `
    <audio class="audioPlayer" src="${verse.audio}" preload="auto"></audio>

`;
  });
  let audios = document.querySelectorAll(".audioPlayer");
  playAudio(audios);
};

function displayChapterHeader(chapterName) {
  return `
    <div id="chapter-header">
      <a class="header-link" id ="translate-link" href=''>Translation</a>
      <a class="header-link" href='' id="read-chapter">Reading</a>
      <a class="header-link" href= "" id="listenQuran">Listen</a>
    </div>
    <h3 style="text-align: center;">${chapterName}</h3>
  
    <div id="verses-container"></div>
  `;
}

const displayVerses = async (chapterId) => {
  let response = await fetch(`http://api.alquran.cloud/v1/surah/${chapterId}`);
  let chapter = await response.json();
  chapters.innerHTML = displayChapterHeader(chapter.data.name);
  let versesContainer = document.getElementById("verses-container");
  let arabicVerses = chapter.data.ayahs;
  arabicVerses.forEach((ayah) => {
    versesContainer.innerHTML += `
    <div>
     <p id="verses" dir="rtl" lang="ar">${ayah.text}</p>
    </div>
    `;
  });
  let translateLink = document.getElementById("translate-link");
  translateLink.addEventListener("click", (e) => {
    e.preventDefault();
    translateLink.classList.add("active-link");
    displayTranslation(chapterId, arabicVerses);
  });

  let readChapter = document.getElementById("read-chapter");
  readChapter.addEventListener("click", (e) => {
    e.preventDefault();
  });

  let listenLink = document.getElementById("listenQuran");
  listenLink.addEventListener("click", (e) => {
    e.preventDefault();
    getAudio(chapterId - 1);
  });
};

const displayTranslation = async (chapterId, arabicVerses) => {
  let response = await fetch(
    `http://api.alquran.cloud/v1/surah/${chapterId}/en.asad`
  );
  let translatedChapter = await response.json();
  chapters.innerHTML = displayChapterHeader(translatedChapter.data.name);
  let versesContainer = document.getElementById("verses-container");
  versesContainer.innerHTML = '<div id="translations"></div>';
  let translationContainer = document.getElementById("translations");
  translatedChapter.data.ayahs.forEach((translation, index) => {
    translationContainer.innerHTML += `
    <div>
    <p dir="rtl" lang="ar">${arabicVerses[index].text}</p>
    <p>${translation.text}</p>
    <br>
    </div>

    `;
  });

  let readChapter = document.getElementById("read-chapter");
  readChapter.addEventListener("click", (e) => {
    e.preventDefault();
    readChapter.classList.add("active-link");
    displayVerses(chapterId);
  });

  let translateLink = document.getElementById("translate-link");
  translateLink.addEventListener("click", (e) => {
    e.preventDefault();
  });
};

let baseApiUrl = "http://api.alquran.cloud/v1/quran/quran-uthmani";
const getAllChapters = async () => {
  pageLoader.style.display = "block";
  let response = await fetch(baseApiUrl);
  let chapter = await response.json();
  pageLoader.style.display = "none";
  chapter.data.surahs.forEach((chapter) => {
    displayAllChaptersInfo(
      chapter.number,
      chapter.name,
      chapter.englishName,
      chapter.englishNameTranslation,
      chapter.ayahs,
      chapter.number
    );
  });
  let chapterInfoBoxes = document.querySelectorAll(".chapter-info");
  chapterInfoBoxes.forEach((chapterInfo) => {
    chapterInfo.addEventListener("click", function (e) {
      e.preventDefault();
      displayVerses(chapterInfo.dataset.id);
    });
  });
};

getAllChapters();

searchInput.addEventListener("input", filterChapter);
