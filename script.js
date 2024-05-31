$(document).ready(function () {
  $('#loading').hide()
  $('#table2').hide()
  // text-part 클릭 이벤트 추가
  $('#text-part').on('click', function () {
    // 클릭된 텍스트 가져오기
    const clickedText = $(this).text()
    // ChatGPT를 통해 레시피 추천 요청
    console.log(clickedText)
    console.log('잠시만 기다려주세요.아래로 스크롤하시면 레시피가 생성됩니다!')
    $('#loading').show()
    $('#table2').show()
    recommendRecipe(clickedText)
  })
})

function recommendRecipe(item) {
  const api_key = config.GPT_KEY // ChatGPT API 키
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

    // 이미지 생성을 위한 데이터
    const imagePrompt = recommendedRecipe

    // 이미지 생성 요청 보내기
    $.ajax({
      url: '/create',
      method: 'POST',
      data: {
        prompt: imagePrompt,
      },
    }).then(function (imageUrl) {
      // 이미지 URL을 받아와서 이미지를 표시
      $('#recipeImage').attr('src', imageUrl)
      $('#recipeImage').show()
    })

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
