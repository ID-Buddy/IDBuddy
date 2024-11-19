const getBlobFromUri = async (uri:string) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
  
      // 요청이 성공했을 때 호출되는 함수
      xhr.onload = function () {
        resolve(xhr.response); // Blob 데이터를 반환
      };
  
      // 요청이 실패했을 때 호출되는 함수
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
  
      // 응답 데이터를 Blob 형식으로 설정
      xhr.responseType = "blob";
  
      // 이미지 URI에서 데이터를 가져오기 위한 GET 요청 시작
      xhr.open("GET", uri, true);
  
      // 요청 전송
      xhr.send(null);
    });
  
    return blob;
  };
  
  export default getBlobFromUri;