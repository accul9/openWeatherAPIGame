const apiKey = config.apiKey;
console.log(apiKey);

// Create an empty annary to store the city names　都市名を入れる配列を作成
let cityNames = [];
// Create an empty array to store the weather of clicked cities 天気の点数を入れる配列を作成
let weatherArray = [];


// Make a function to shuffle the array  配列をシャッフルする関数を作成 
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fetch the content of city.json　city.jsonの中身を取得
fetch('city.json')
  .then(response => response.json())
  .then(jsonArray => {
    // Loop through the array and add names of each city into the cityName array　ループで各都市の名前をcityName配列に追加
    jsonArray.forEach((obj, i) => {
      const cityName = obj.name;
      cityNames.push(cityName);
    });

    // Shuffle the array 配列をシャッフル
    shuffle(cityNames);
    // Slice the array to get the first 9 elements 配列の最初の9つの要素を取得
    const newCityNames = cityNames.slice(0, 9);

    // Insert elements of the newCityNames into HTML cell HTMLのセルにnewCityNamesの要素を挿入
    for (let i = 0; i < newCityNames.length; i++) {
      const cell = document.getElementById('cell' + (i + 1));
      cell.textContent = newCityNames[i];

      // Add event listener for click event　クリックイベントのイベントリスナーを追加
      cell.addEventListener('click', () => {
        cell.style.backgroundImage = 'none';
        cell.style.backgroundColor = '#626e85';

        // Fetch weather data for the city  
        const cityName = cell.textContent;
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
          .then(response => response.json())
          .then(weatherData => {
            // Get the weather icon id
            const iconId = weatherData.weather[0].icon;

            // Generate the icon URL
            const iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;

            // Get the current weather
            const weather = weatherData.weather[0].main;

            // Insert the weather icon and the current weather into the HTML cell

            cell.innerHTML = `<p>${cityName}</p><img src="${iconUrl}" alt="Weather icon"><p>${weather}</p>`;

            // Assign a value to the weather　天気に点数を割り当てる
            let weatherValue;
            switch (weather) {
              case 'Clear':
                weatherValue = 20;
                break;
              case 'Clouds':
                weatherValue = 8;
                break;
              case 'Drizzle':
                weatherValue = 2;
                break;
              case 'Rain':
                weatherValue = -1;
                break;
              case 'Snow':
                weatherValue = -3;
                break;
              case 'Thunderstorm':
                weatherValue = -7;
                break;
              default:
                weatherValue = 0;
            }

            // Add the weather value to the array 天気の点数を配列に追加
            weatherArray.push(weatherValue);

            // Calculate the total value of the array 天気の点数の合計を計算
            const totalValue = weatherArray.reduce((a, b) => a + b, 0);

            // If the array length is 6, display the curtain div 配列の長さが6の場合、curtain divを表示
            if (weatherArray.length === 6) {
              // Delay the execution by 0.6 seconds すぐ実行すると天気のアイコンが見れないので、0.6秒後に実行を遅らせる
              setTimeout(() => {
                document.getElementById('curtain').style.display = 'block';
              }, 600);
            }

            // Insert the total value into the h2 tag h2タグに合計点数を挿入
            document.getElementById('tlPoint').textContent = `あなたのてるてる坊主パワーは：${totalValue}点`;
          })
          .catch(error => console.error('Error fetching weather data:', error));
      });

      // Add event listener for the reset button　リセットボタンの効果を追加
      document.getElementById('resetButton').addEventListener('click', () => {
        // Hide the curtain div - curtain divを隠す
        document.getElementById('curtain').style.display = 'none';

        // Reset the weatherArray　天気の点数の配列をリセット
        weatherArray = [];

        // Reset the content of each cell to cityNames and reset the background image　各セルの内容をcityNamesにリセットし、背景画像もリセット
        cityNames = []; // Reset the cityNames array
        jsonArray.forEach((obj, i) => {
          const cityName = obj.name;
          cityNames.push(cityName);
        });
        shuffle(cityNames);
        const newCityNames = cityNames.slice(0, 9);

        // Insert "name" field into HTML cell HTMLのセルにnameフィールドを挿入
        for (let i = 0; i < newCityNames.length; i++) {
          const cell = document.getElementById('cell' + (i + 1));
          cell.textContent = newCityNames[i];
        };

        cell.style.backgroundImage = 'url("neko-teru.png")'; //バックグラウンド画像を改めて設定
        cell.style.backgroundColor = 'rgb(149, 195, 233)';

        // Reset the h2 tag　h2タグをリセット
        document.getElementById('tlPoint').textContent = '';
      });
    }

  });

