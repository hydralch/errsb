// random-bg.js
// Behavior:
// 1) Try to fetch /images/list.json (an array of filenames) if provided.
// 2) If not present, try to fetch /images/ and parse a directory listing (works when the server shows directory indexes).
// 3) Fallback to a hardcoded filename 'images/default.jpg'.
// Put your images inside the 'images/' folder. Optionally create images/list.json with ["a.jpg","b.png"] to control the list.

(async function(){
  const container = document.getElementById('bg');
  function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  async function tryListJson(){
    try{
      const res = await fetch('/errsb/images/list.json', {cache: 'no-store'});
      if(!res.ok) return null;
      const data = await res.json();
      if(Array.isArray(data) && data.length) return data.map(p => (p.startsWith('/')? p : `/images/${p}`));
    }catch(e){/*ignore*/}
    return null;
  }

  async function tryDirectoryListing(){
    try{
      const res = await fetch('/images/', {cache: 'no-store'});
      if(!res.ok) return null;
      const text = await res.text();
      // Look for hrefs to common image extensions
      const re = /href\s*=\s*\"([^\"]+\.(?:png|jpg|jpeg|gif|webp|svg))\"/ig;
      const found = [];
      let m;
      while((m = re.exec(text)) !== null){
        let href = m[1];
        // make it absolute to /images/
        if(!href.startsWith('http') && !href.startsWith('/')) href = `/images/${href}`;
        if(!found.includes(href)) found.push(href);
      }
      return found.length ? found : null;
    }catch(e){return null}
  }

  function preloadImage(url){
    return new Promise((resolve,reject)=>{
      const img = new Image();
      img.onload = ()=>resolve(url);
      img.onerror = reject;
      img.src = url;
    });
  }

  let images = await tryListJson();
  if(!images) images = await tryDirectoryListing();

  if(!images || !images.length){
    // fallback: try to use a single default image file
    const fallback = '/images/default.jpg';
    try{
      await preloadImage(fallback);
      images = [fallback];
    }catch(e){
      // Nothing available, keep a plain background color
      console.warn('No images found in /images/. Place images there or add /images/list.json');
      return;
    }
  }

  // pick a random image
  const chosen = pickRandom(images);
  try{
    await preloadImage(chosen);
    container.style.backgroundImage = `url('${chosen}')`;
    // small timeout to ensure transition
    requestAnimationFrame(()=> container.classList.add('loaded'));
  }catch(e){
    console.error('Failed to load chosen background', chosen, e);
  }
})();
