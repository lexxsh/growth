import GPT_KEY from './apikey'

$(document).ready(function () {
  $('#loading').hide()
  $('#table2').hide()
  // text-part 클릭 이벤트 추가
  $('#text-part').on('click', function () {
    // 클릭된 텍스트 가져오기
    const clickedText = $(this).text()
    // ChatGPT를 통해 레시피 추천 요청
    console.log(clickedText)
    $('#loading').show()
    $('#table2').show()
    recommendRecipe(clickedText)
  })
})

function recommendRecipe(item) {
  const api_key = GPT_KEY // ChatGPT API 키
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    {
      role: 'user',
      content: item + '에 대하여 최대한 도움이 되는 레시피를 추천해주세요.',
    },
  ]

  const data = {
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    n: 1,
    messages: messages,
  }

  $.ajax({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + api_key,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  }).then(function (response) {
    $('#loading').hide()
    const recommendedRecipe = response.choices[0].message.content
    // 개행 문자(\n)를 HTML의 <br> 태그로 변환
    const formattedRecipe = recommendedRecipe.replace(/\n/g, '<br>')
    // 결과를 result div에 HTML로 추가
    let resultText = {
      item: item.trim(), // 텍스트 양 끝의 공백 제거
      recommendedRecipe: formattedRecipe.trim(), // 추천 레시피의 양 끝 공백 제거
    }
    resultText = JSON.stringify(resultText, null, 2)
    // JSON 문자열 내의 \n을 <br>로 변환
    resultText = resultText.replace(/\\n/g, '<br>')
    // HTML로 변환하여 결과를 result div에 추가
    $('#result').html(resultText)
  })
}
