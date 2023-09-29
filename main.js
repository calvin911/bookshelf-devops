document.addEventListener('DOMContentLoaded',function(){
    const inputBook = document.getElementById('inputBook');
    const RENDER_EVENT = 'render-todo';
    let data = [];
    
    inputBook.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

/*-------------tambah rak buku--------------------*/

    function addBook(){
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
		const isCompleted = document.getElementById("inputBookIsComplete").checked;
		const generateID = generateId();		
       	const generateData = generateDataObject(generateID,title,author,year,isCompleted);
        data.push(generateData);
        document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
		alert("Buku " + title+" Telah ditambahkan");
    }
    
    
    function generateId(){
        return +new Date();
    }
    
    
    function generateDataObject(id,title,author,year,isCompleted){
        return{
            id,title,author,year,isCompleted
        }
    }
	
	
    document.addEventListener(RENDER_EVENT, function(){
        const ListBelumCompleted = document.getElementById('incompleteBookshelfList');
        ListBelumCompleted.innerHTML = '';
        const ListSudahCompleted = document.getElementById('completeBookshelfList');
        ListSudahCompleted.innerHTML = '';
        for(const item of data){
            const dataElement = buatElement(item);

            if(!item.isCompleted){
                ListBelumCompleted.append(dataElement);
            }else
             ListSudahCompleted.append(dataElement);
        }
    });


    function buatElement(generateData){
        const textJudul = document.createElement('h2');
        textJudul.innerText = generateData.title;
        
        const textPenulis = document.createElement('p');
        textPenulis.innerText = "Penulis : "+ generateData.author;
        
        const textTahun = document.createElement('p');
        textTahun.innerText = "Tahun : "+ generateData.year;
        
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textJudul, textPenulis,textTahun);
        
     	const container = document.createElement('div');
     	container.classList.add('lapisan');
     	container.append(textContainer);
     	container.setAttribute('id',`data-${generateData.id}`);
     	
        const button_hapus = document.createElement('button');
        button_hapus.classList.add('button','hapus');
		button_hapus.innerText = "Hapus Buku";
     	button_hapus.addEventListener('click',function(){

     		hapusBuku(generateData.id);
     		alert("buku " + generateData.title + " telah dihapus!");
     	});
     	
     	const button_belumSelesai = document.createElement('button');
        button_belumSelesai.classList.add('button','belumSelesai');
        
        if(generateData.isCompleted){	
        	button_belumSelesai.innerText = "Belum Selesai dibaca";
     		button_belumSelesai.addEventListener('click',function(){

     		ubah_status_belum(generateData.id);
			});
			container.append(button_belumSelesai,button_hapus);
        }
        else{
        	button_belumSelesai.innerText = "Sudah Selesai dibaca";
     		button_belumSelesai.addEventListener('click',function(){

     		ubah_status_sudah(generateData.id);
     		});
			container.append(button_belumSelesai,button_hapus);
        }
       return container;
    }
    
    
    function findIndexData(Id){
    	for(const index in data){
    		if(data[index].id == Id){
    			return index;
    		}
    	}
    	return -1;
    }
    
    
    function hapusBuku(Id){
    	const TargetBuku = findIndexData(Id);

    	if(TargetBuku === -1){
    		return
    	}
    	data.splice(TargetBuku, 1);
    	document.dispatchEvent(new Event(RENDER_EVENT));
    	saveData();
    }
    
    
    function findData(Id){
    	for(const item of data){
    		if(item.id === Id){
    			return item;
    		}
    	}
    	return null;
    }
    
    
    function ubah_status_belum(Id){
    	const TargetBuku = findData(Id);
    	if(TargetBuku === null){
    		return
    	}
    	TargetBuku.isCompleted = false;
    	document.dispatchEvent(new Event(RENDER_EVENT));
    	saveData();
    }
    
    
    function ubah_status_sudah(Id){
    	const TargetBuku = findData(Id);
    	if(TargetBuku === null){
    		return;
    	}
    	TargetBuku.isCompleted = true;
    	document.dispatchEvent(new Event(RENDER_EVENT));
    	saveData();
    }
    


/*------------Storage Data-------------*/

const SAVED_EVENT = 'saved-data';
const STORAGE_KEY = 'DATA_APPS';

	function isStorageExist(){
		if(typeof(Storage) == undefined){
			alert('browser local storage tidak berfungsi');
			return false;
		}
		return true;
	}
	
	
    function saveData(){
    	if(isStorageExist()){
    		const parsed = JSON.stringify(data);
    		localStorage.setItem(STORAGE_KEY, parsed);
    		//document.dispatchEvent(new Event(SAVED_EVENT));
    	}
    }
    
    
    function loadDataFromStorage(){
    	const serializedData = localStorage.getItem(STORAGE_KEY);
    	let data_storage = JSON.parse(serializedData);
    	
    	if(data_storage !== null){
    		for(const input of data_storage){
    			data.push(input);
    		}
    	}
		document.dispatchEvent(new Event(RENDER_EVENT));
    }
    
    
    document.addEventListener(SAVED_EVENT, function(){
    	console.log(localStorage.getItem(STORAGE_KEY));
    	
    	if(isStorageExist()){
    		loadDataFromStorage();
    	}
    });

/*--------------cari buku--------------------*/
 
    const cariJudul = document.getElementById('searchBook');
    
    cariJudul.addEventListener('submit',function(event){
    	event.preventDefault();
    	const openList = document.querySelector('#book_shelf_list');
    	openList.removeAttribute('hidden');
    	const judul_penulis = document.getElementById('searchBookTitle').value;
    	searchData(judul_penulis);

    });
    function searchData(judul_penulis){
    	if(isStorageExist()){
			let cekData = [];
    		if(localStorage.getItem(STORAGE_KEY) != null){
    			cekData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    			data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    		}
    		
    		
    		let penampung = [];
    		for(const item of cekData){
    			const data_nama = item.title;
				const split_data_nama = data_nama.split(" ");
				const split_judul_penulis = judul_penulis.split(" ");
				let jumlah_kata = split_judul_penulis.length;
				let penentuan = false;
				
				for(let i = 0; i< jumlah_kata;i++){
					if(split_data_nama[i] == split_judul_penulis[i]){
						penentuan = true;	
    				}
    				else if(split_data_nama[i] != split_judul_penulis[i]){
    					penentuan = false;
    					i = jumlah_kata;
    				}
				}
				if(penentuan){
					penampung.push(item);
				}
    		}
    		eventData(penampung);
    	}
    }
   
   
   function eventData(items){
        const ListBelumCompleted = document.getElementById('incompleteBookshelfList');
        ListBelumCompleted.innerHTML = '';
        const ListSudahCompleted = document.getElementById('completeBookshelfList');
        ListSudahCompleted.innerHTML = '';
        const ListBuku = document.getElementById('BookshelfList');
        ListBuku.innerHTML = '';
        
        for(const item of items){
            const dataElement = dataBuku(item);
			
            ListBuku.append(dataElement);
             
        }
        for(const item of items){
            const dataElement = dataBuku(item);
			
            if(!item.isCompleted){
                ListBelumCompleted.append(dataElement);
            }else{
             ListSudahCompleted.append(dataElement);}
             
        }
	}
	
	
	function dataBuku(item){
		const textJudul = document.createElement('h2');
        textJudul.innerText = item.title;
        
        const textPenulis = document.createElement('p');
        textPenulis.innerText = "Penulis : "+ item.author;
        
        const textTahun = document.createElement('p');
		textTahun.innerText = "Tahun : "+ item.year;
		
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textJudul, textPenulis,textTahun);
        
     	const container = document.createElement('div');
     	container.classList.add('lapisan');
     	container.append(textContainer);
     	container.setAttribute('id',`data-${item.id}`);
     	    
        const button_hapus = document.createElement('button');
        button_hapus.classList.add('button','hapus');
		button_hapus.innerText = "Hapus Buku";
     	button_hapus.addEventListener('click',function(){
     		hapusBuku(item.id);
     		alert("buku " + item.title + " telah dihapus!");
     	});
     	
     	const button_belumSelesai = document.createElement('button');
        button_belumSelesai.classList.add('button','belumSelesai');  
           
        if(item.isCompleted){  	
        	button_belumSelesai.innerText = "Belum Selesai dibaca";
     		button_belumSelesai.addEventListener('click',function(){

     		ubah_status_belum(item.id);
			});
			container.append(button_belumSelesai,button_hapus);
        }
        else{
        	button_belumSelesai.innerText = "Sudah Selesai dibaca";
     		button_belumSelesai.addEventListener('click',function(){

     		ubah_status_sudah(item.id);
     		});
			container.append(button_belumSelesai,button_hapus);

        }
       return container;
	}
   
});






