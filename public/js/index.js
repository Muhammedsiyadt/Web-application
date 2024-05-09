
// data insert alert
// $("#add_user").submit(function (event){
//         alert("Data inserted successfully")
// })



// update user using ajax
// $('#update_user').submit(function(event){
//     event.preventDefault();

//     var unindexed_array = $('#update_user').serializeArray();
//     // or $('this')

//     var data={}
//     $.map(unindexed_array,function(n,i){
//         data[n['name']]=n['value']
//     })
//     // console.log(data);

//     var request = {
//         "url":`http://localhost:3000/api/users/${data.id}`,
//         "method":"PUT",
//         "data":data
//     }

//     $.ajax(request).done(function(response){
//         alert("Data updated successfully")
//     })


// })

// delete user ajax

if(window.location.pathname=="/admindash"){

    $ondelete = $(".table tbody td a.delete");
    console.log("hello from ajax");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url":`http://localhost:3000/api/users/${id}`,
            "method":"DELETE"
        }
        
        if(confirm("Do you want to delete the record")){
            $.ajax(request).done(function(response){
                alert("Data deleted successfully")
                location.reload()
            })
        }
      
    

    })
}
// Search jquery
$(document).ready(function () {
    // When the user types in the search box
    $("#name-search").on("keyup", function () {
        var searchText = $(this).val().toLowerCase();

        // Loop through each table row
        $("table tbody tr").each(function () {
            var userName = $(this).find("td:eq(1)").text().toLowerCase(); // Get the user's name in lowercase

            // If the user's name contains the search text, show the row; otherwise, hide it
            if (userName.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});

function goBack() {

    window.history.back()
    
    }