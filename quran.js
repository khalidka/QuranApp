const chapters = document.querySelector(".chapters");

let baseApiUrl = "http://api.alquran.cloud/v1/quran/quran-uthmani";
const getAllChapters = async () => {
  pageLoader.style.display = "block";
  let response = await fetch(baseApiUrl);
  let chapter = await response.json();
  pageLoader.style.display = "none";
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
