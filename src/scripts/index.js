
function Loaddash(){
    if($.cookie('userid')){
        $.ajax({
        method:"get",
        url:`../../public/pages/user-dash.html`,
        success:(response)=>{

            $('section').html(response);
            $('#lbluser').html($.cookie('userid'))
            $.ajax({
                method:'get',
                url:`http://127.0.0.1:4040/appointments/${$.cookie('userid')}`,
                success:(appointments=>{
                    appointments.map(appointment=>{
                        $(`<div class="card p-2 m-2  bg-success" style="box-shadow: 2px 2px 2px black; width:350px;">
                            <div class="card-header bg-warning">
                                <h2 class="card-title text-center">${appointment.title}</h2>

                            </div>
                            <div class="card-body text-white">
                                <p class="bi bi-pencil-square"> ${appointment.description}</p>
                                <div class="bi bi-calendar"> ${appointment.date.slice(0,appointment.date.indexOf("T"))}</div>
                            </div>
                            <div class="card-fotter d-flex justify-content-between">
                                <button value=${appointment.appointment_id} id="btnedit" class=" btn btn-warning bi bi-pen-fill mx-2">Edit</button>
                                <button value=${appointment.appointment_id} id="btndelete" class="btn btn-danger bi bi-trash mx-2">Delete</button>
                            </div>

                            
                            
                        </div>`).appendTo('#appointments')
                    })
                })
            })
        }
    })

   }else{
        $.ajax({
        method:"get",
        url:`../../public/pages/${page_name}`,
        success:(response)=>{
            $('section').html(response);
        }
    })
   }
}
function Loadpage(page_name){
        $.ajax({
        method:"get",
        url:`../../public/pages/${page_name}`,
        success:(response)=>{
            $('section').html(response);
        }
    })
}
$(function(){
    Loadpage('home.html');

    //on click New User--Home
    $(document).on('click','#btnnewuser',()=>{
        Loadpage("new_user.html")
    })

    //on click Sign In --Home
    $(document).on("click","#btnsigin",()=>{
        Loadpage("user_login.html")
    })
    $(document).on("click","#existinguser",()=>{
        Loadpage("user_login.html")
    })
    $(document).on("click","#Newuser",()=>{
        Loadpage("new_user.html")
    })

    //register user ---post data

    $(document).on("click","#btnregister",()=>{

        var user={
            user_id:$('#user_id').val(),
            user_name:$('#user_name').val(),
            password:$('#password').val(),
            mobile:$('#mobile').val()
        }
        $.ajax({
            method:"post",
            url:`http://127.0.0.1:4040/register-user`,
            data:user,
            success:()=>{
                alert('User Registered');
                Loadpage("user_login.html");
            },
            error:(err)=>{
                alert('Registration failed');
                console.error(err);
            }

        });
        
    });

    // login button click
    $(document).on("click","#btnlogin",()=>{
        var user_id=$("#user_id").val();
        $.ajax({
            method:'get',
            url:`http://127.0.0.1:4040/users/${user_id}`,
            success:(userDetails)=>{
                if(userDetails){
                    if($('#password').val()===userDetails.password){
                        $.cookie('userid',$('#user_id').val(),{expires:2})
                        Loaddash()
                    }else{
                        alert('Invalid Password');
                    }
                    
                }else{
                    alert("Not found")
                }
            }
        })
    })

    //signout click
    $(document).on("click",'#btnsignout',()=>{
        $.removeCookie('userid');
        Loadpage('home.html')
    })

    //new apointment
    $(document).on("click",'#btnnewappointment',()=>{
        Loadpage('add-appointment.html')
    })
    //add apointment
    $(document).on("click",'#btnadd',()=>{
        var appointment={
            appointment_id:$('#appointment_id').val(),
            title:$('#title').val(),
            description:$('#description').val(),
            date:$('#date').val(),
            user_id:$.cookie('userid')
        }
        $.ajax({
            method:'post',
            url:`http://127.0.0.1:4040/add-appointment`,
            data:appointment
        })
        alert('Appointment Added')
        Loaddash();
    })
    //click on cancel

    $(document).on("click",'#btncancel',()=>{
        Loaddash();
    })
    //edit appointment
    $(document).on('click','#btnedit',(e)=>{
        Loadpage('edit_appointment.html')
        $.ajax({
            method:'get',
            url:`http://127.0.0.1:4040/appointment/${e.target.value}`,
            success:(appointment=>{
                $("#appointment_id").val(appointment.appointment_id),
                $("#title").val(appointment.title),
                $("#description").val(appointment.description),
                $('#date').val(appointment.date.slice(0,appointment.date.indexOf("T")))
                sessionStorage.setItem("appointment_id",appointment.appointment_id);

            })
        })

    })
    //edit cancel
    $(document).on("click","#btneditcancel",()=>{
        Loaddash();
    })

    //save
     $(document).on("click",'#btsave',(e)=>{
        var appointment={
            appointment_id:$('#appointment_id').val(),
            title:$('#title').val(),
            description:$('#description').val(),
            date:$('#date').val(),
            user_id:$.cookie('userid')
        }
        $.ajax({
            method:'put',
            url:`http://127.0.0.1:4040/edit-appointment/${sessionStorage.getItem("appointment_id")}`,
            data:appointment
        })
        alert('Appointment Updated Successfully')
        Loaddash();
    })
    //delete click
    $(document).on('click','#btndelete',(e)=>{
        var choice=confirm('Do you want Delete?')
        if(choice==true){
            $.ajax({
            method:'delete',
            url:`http://127.0.0.1:4040/delete-appointment/${e.target.value}`,
            
            })
            alert('Appointment Deleted..')
            Loaddash();
        }
        
    })

})