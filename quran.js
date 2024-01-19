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

const displayVerses = async (chapterId) => {
  let response = await fetch(`http://api.alquran.cloud/v1/surah/${chapterId}`);
  let chapter = await response.json();
  chapters.innerHTML = `
    <h3>${chapter.data.name}</h3>
    <a href=''>Reading</a>
    <a id ="translate-link"href=''>Translation</a>
  `;
  chapter.data.ayahs.forEach((ayah) => {
    chapters.innerHTML += `
    <p dir="rtl" lang="ar">${ayah.text}</p>
    `;
  });
  let translateLink = document.getElementById("translate-link");
  translateLink.addEventListener("click", (e) => {
    e.preventDefault();
    displayTranslation(chapterId);
  });
};

const displayTranslation = async (chapterId) => {
  let response = await fetch(
    `http://api.alquran.cloud/v1/surah/${chapterId}/en.asad`
  );
  let translations = await response.json();
  chapters.innerHTML = `
    <h3>${translations.data.name}</h3>
    <a href=''id="read-chapter">Reading</a>
    <a id ="translate-link"href=''>Translation</a>
  `;

  translations.data.ayahs.forEach((translation) => {
    chapters.innerHTML += `
    <p>${translation.text}</p>
    `;
  });

  let readChapter = document.getElementById("read-chapter");
  readChapter.addEventListener("click", (e) => {
    e.preventDefault();
    displayVerses(chapterId);
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
