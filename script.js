$(document).ready(function () {
  $('#loading').hide()
  $('#table2').hide()
  // text-part 클릭 이벤트 추가
  $('#text-part').on('click', function () {
    // 클릭된 텍스트 가져오기
    const clickedText = $(this).text()
    // ChatGPT를 통해 레시피 추천 요청
    console.log(clickedText)
    alert('잠시만 기다려주세요.아래로 스크롤하시면 레시피가 생성됩니다!')
    $('#loading').show()
    $('#picture').show()
    $('#picture1').show()
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
      url: 'https://api.openai.com/v1/images/generations', // DALL·E 이미지 생성 API 엔드포인트
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + api_key, // DALL·E API 키
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        model: 'dall-e-3', // DALL·E 모델 버전, 실제 사용 가능한 버전 확인 필요
        prompt: imagePrompt, // 이미지 생성을 위한 텍스트 프롬프트
        n: 1, // 생성할 이미지의 수
        size: '1024x1024', // 이미지 크기, 사용 가능한 옵션 확인 필요
      }),
    })
      .then(function (response) {
        const imageUrl = response.data[0].url
        console.log(imageUrl)
        $('#picture').hide()
        $('#imageButton').show() // 이미지 보러가기 버튼 표시
        // 이미지 보러가기 버튼 클릭 시 이미지 보기
        $('#imageButton').click(function () {
          window.open(imageUrl)
        })
      })
      .catch(function (error) {
        console.error('이미지1 생성 요청 실패:', error)
      })
    $.ajax({
      url: 'https://api.openai.com/v1/images/generations', // DALL·E 이미지 생성 API 엔드포인트
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + api_key, // DALL·E API 키
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        model: 'dall-e-3', // DALL·E 모델 버전, 실제 사용 가능한 버전 확인 필요
        prompt: item + '을 활용한 음식을 이미지로 표현해줘', // 이미지 생성을 위한 텍스트 프롬프트
        n: 1, // 생성할 이미지의 수
        size: '1024x1024', // 이미지 크기, 사용 가능한 옵션 확인 필요
      }),
    })
      .then(function (response) {
        const imageUrl1 = response.data[0].url
        $('#picture1').hide()
        console.log(imageUrl1)
        $('#image2Button').show() // 이미지 보러가기 버튼 표시
        // 이미지 보러가기 버튼 클릭 시 이미지 보기
        $('#image2Button').click(function () {
          window.open(imageUrl1)
        })
      })
      .catch(function (error) {
        console.error('이미지2 생성 요청 실패:', error)
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
