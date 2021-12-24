function average(arr){
    let sum=0;
    arr.forEach(element => {
        sum+=element;
    });
    return sum/arr.length;
}

//module.exports = average;   way1

//way2
module.exports= {
  avg : average,
  name : "Suren",
  lang : "C++"
}

// module.exports.name = "Suren";    way3

