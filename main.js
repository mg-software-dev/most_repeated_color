

//-------------------------------------------------------------
//-------------------------------------------------------------
// this will be used to sort the array containing
// the number of times a color appears in the image
// im talking about numbers here, for example
// there will be a lot of colors that appear once
// so the array will look like this 
// [1,1,1,1,1,1,1,1,1,1,1,2,2,2,3,4,4,4,4,4,4,5]...

const quickSort = (arrToSort) =>
{
  
  if(arrToSort.length < 2 ) 
  {
    return arrToSort;
  }
  else
  {
    let lessArr = [];
    let eqArr = [];
    let greaterArr = [];

    let pivot = (arrToSort.length / 2) | 0;
  
    for (let i = 0, len = arrToSort.length; i < len; i++)
    {
      if(arrToSort[i] < arrToSort[pivot])
      {
        lessArr.push(arrToSort[i]);
      }
      else if(arrToSort[i] === arrToSort[pivot])
      {
        eqArr.push(arrToSort[i]);
      }
      else if(arrToSort[i] > arrToSort[pivot])
      {
        greaterArr.push(arrToSort[i]);
      }

    }
    return quickSort(lessArr).concat(eqArr, quickSort(greaterArr));
  }
}





//-------------------------------------------------------------
//-------------------------------------------------------------
const inputs = document.querySelectorAll('[name=how_many]');

let colors_to_show = 3;

let final_colors_arr = [];


//get the number of colors for the palette
//-------------------------------------------------------------
for (const input of inputs)
{
    input.addEventListener("change", function(evt)
    {
        switch (evt.target.value)
        {
            case "3":
                colors_to_show = 3;
            break;

            case "6":
                colors_to_show = 6;
            break;

            case "9":
                colors_to_show = 9;
            break;


            default:
                break;
        }
    });
}


//-------------------------------------------------------------
//-------------------------------------------------------------
let canvas_elem = document.getElementById("img_canvas");

let input_img_el = document.getElementById("img_input");

input_img_el.accept = "image/*";

let file_name_label = document.getElementById("img_file_name");



// load the image in the canvas to get the pixels later
//-------------------------------------------------------------
input_img_el.onchange = ()=>
{
    let ctx = canvas_elem.getContext("2d");

    let uploaded_img = new Image();
    uploaded_img.crossOrigin = 'anonymous';
    uploaded_img.src =  window.URL.createObjectURL(input_img_el.files[0]);

    file_name_label.innerText = input_img_el.files[0].name;
    
    uploaded_img.onload = ()=>
    {
        canvas_elem.width = uploaded_img.width;
        canvas_elem.height = uploaded_img.height;

        ctx.clearRect(0, 0, canvas_elem.width, canvas_elem.height);

        ctx.drawImage(uploaded_img,0, 0);
    };

};



//-------------------------------------------------------------
//-------------------------------------------------------------
const getPaletteFromImg =()=>
{
    if (!input_img_el.files || !input_img_el.files[0]) return;

    let ctx = canvas_elem.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas_elem.width, canvas_elem.height);

    const data = imageData.data;

    //resets the array after the first call
    final_colors_arr.length = 0; 

    let rgba_arr = [];
    
    // in this step we iterate through the array
    // and we get the rgba blocks of every pixel
    for (var i = 0, len = data.length; i < len; i += 4)
    {
        let temp_pixel = [data[i],data[i + 1],data[i + 2],data[i + 3]];
        rgba_arr.push(temp_pixel);
    }

    // here we have to split the array at least in 4
    // because if not, the process will hang
    let len_rgba = Math.floor(rgba_arr.length/4);

    // here we store the number of times
    // a color is present in the image
    //and its color value
    // ex : { "123,32,43,221" : 55 }
    let color_counter = {};
    
    // here we store the NUMBER of times
    // a color is present in the image
    // the total amount per color
    let values_to_sort = []

    // we start counting the repeated values with 1
    let cnt = 1;

    let last_index = 0;

    // here we check how many times a color is in the image
    // so we can return a number of colors acording to the 
    // palette_colors variable
    for(let i = 0 , tl = 4; i < tl; i++) 
    { 
        let tl2 = len_rgba * (i+1);

        for(let j = last_index; j < tl2; j+=30)
        {
            let temp = JSON.stringify(rgba_arr[j]);

            if(!color_counter[temp])
            {
                color_counter[temp] = cnt;
            }
            else if(color_counter[temp])
            {
                color_counter[temp] = color_counter[temp] + 1;
            }
        }

        last_index =  tl2; 
    }


    //console.log(color_counter);

    
    // reset the index to loop again
    last_index = 0;

    // in this object we store
    // a reference to the color
    // based on the number of times 
    // that appears in the image
    // ex : { 55 : "123,32,43,221" }
    let counter_color = {};

    // get the array with the number of repeated colors
    // to sort them in the next step
    for(let i = 0 , tl = 4; i < tl; i++) 
    { 
        let tl2 = len_rgba * (i+1);

        for(let j = last_index; j < tl2; j+=30)
        {
            let temp = JSON.stringify(rgba_arr[j]);

            values_to_sort.push(color_counter[temp]);

            counter_color[color_counter[temp]] = temp;
        }

        last_index =  tl2; 
    }

    // now that we have the object with every color
    // and the times it appears in the image, we need
    // to sort this and return the colors with more repeptition
    // based on the amount of wanted colors for the palette
    //(so, the higher numbers of the array)
    values_to_sort = quickSort(values_to_sort);

    //because it returns a lot or repeated values
    // it's necessary to filter the array
    values_to_sort = new Set([...values_to_sort]);
    
    // go back to array
    values_to_sort = Array.from(values_to_sort);

    // now that we have the N most repeated colors, its time
    // to return them:
    
    values_to_sort.map((value)=>
    {
        final_colors_arr.push(JSON.parse(counter_color[value]));
    });


    //---------------------------------------------
    let total_colors =  final_colors_arr.length - colors_to_show;

    for(let i = 0 ; i < total_colors; i++)
    {
        final_colors_arr.pop();
    }


    //empty some memory
    rgba_arr.length = 0;


    //---------------------------------------------
    let color_blocks_div = document.getElementById("color_blocks");

    try
    {
        // erase the references from the previous selection
        while(color_blocks_div.firstChild)
        {
            color_blocks_div.removeChild(color_blocks_div.firstChild);
        }
    }
    catch(e)
    {}


    //---------------------------------------------
    for(let i = 0 , len = final_colors_arr.length; i < len ; i++ )
    {
        let p_color = `rgba(${final_colors_arr[i][0]},${final_colors_arr[i][1]}, ${final_colors_arr[i][2]},${final_colors_arr[i][3]})`;

        let temp = document.createElement("div");
        temp.classList.add("palette_block");
        temp.style.backgroundColor = p_color;

        let temp_p = document.createElement("p");
        temp_p.innerText = p_color;

        temp.appendChild(temp_p);

        color_blocks_div.appendChild(temp);
    }

}



//-------------------------------------------------------------
//-------------------------------------------------------------
let btn_get_palette = document.getElementById("btn_get_palette");


btn_get_palette.addEventListener("click",getPaletteFromImg);