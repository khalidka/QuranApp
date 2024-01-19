const chapters = document.querySelector(".chapters");
const searchInput = document.querySelector("#search");

const displayAllChaptersInfo = (
  chapterInArabicName,
  chapterInEnglishName,
  englishNameTranslation,
  TotalVersesInChapter,
  chapterNumber
) => {
  chapters.innerHTML += `
  <div class='chapter-info'>
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
        ${TotalVersesInChapter}
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

let baseApiUrl = "http://api.alquran.cloud/v1/quran/quran-uthmani";
const getAllChapters = async () => {
  let response = await fetch(baseApiUrl);
  let chapter = await response.json();

  chapter.data.surahs.forEach((chapter) => {
    displayAllChaptersInfo(
      chapter.name,
      chapter.englishName,
      chapter.englishNameTranslation,
      chapter.ayahs.forEach((verse) => {
        verse.numberInSurah;
      }),
      chapter.number
    );
  });
};
getAllChapters();

searchInput.addEventListener("input", filterChapter);
