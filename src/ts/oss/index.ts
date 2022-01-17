// import * as OSS from "ali-oss";

// class OSSMaster {
//     public ossUrl: string;

//     constructor(url: string) {
//         this.ossUrl = url;
//     }



//     public getCredentials(title: string,token: string){
//         const xhr = new XMLHttpRequest();
//         try {
//             debugger
//             xhr.open("GET", this.ossUrl + "?title="+title, false);
//             xhr.setRequestHeader('X-Token', token);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState == 4 && xhr.status == 200) {
//                     console.log("STS信息: " + xhr.response)
//                     let stsData = JSON.parse(xhr.response).data;
//                     var client = new OSS({
//                         accessKeyId: stsData.accessKeyId,
//                         accessKeySecret: stsData.accessKeySecret,
//                         stsToken: stsData.securityToken,
//                         bucket: stsData.bucket,
//                         region: stsData.region
//                     })
//                    return client;
//                 }
//             }
//             xhr.send();
//         } catch (e) {
//             console.log("上传文件出错，请查看控制台输出!");
//             console.log(e);
//         }
//         console.log("结束");
//     }

//     public load() {
//         this.initial = document.getElementById('diagram').innerHTML;
//         this.start();
//     };

//     public start() {
//         this.name = (window.location.hash.length > 1) ? window.location.hash.substring(1) : 'default';
//         var current = localStorage.getItem(this.name);

//         if (current != null) {
//             var entry = JSON.parse(current);
//             document.getElementById('diagram').innerHTML = entry.data;
//         }
//         else {
//             document.getElementById('diagram').innerHTML = this.initial;
//         }
//     };
// }


// export { OSSMaster };
