const iframe = document.getElementById('iframe')

const lis = document.getElementsByTagName('li')
iframe.setAttribute('src', lis.item(0).innerText)

for(let li of lis){
  li.onclick = () => {
    iframe.setAttribute('src', li.innerText)
  }
}
