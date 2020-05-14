// Your web app's Firebase configuration
    var firebaseConfig = {
    apiKey: "AIzaSyCuzMDALA6IDegRI8-suNTEgm1ZJLwDHhI",
    authDomain: "performance-food-1566579119507.firebaseapp.com",
    databaseURL: "https://performance-food-1566579119507.firebaseio.com",
    projectId: "performance-food-1566579119507",
    storageBucket: "performance-food-1566579119507.appspot.com",
    messagingSenderId: "386651551755",
    appId: "1:386651551755:web:b127ed813e78bf80112f0e",
    measurementId: "G-P0HSJ7KDYL"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();



var privatePages = [
  '/members-club',
  '/account/profile',
  '/category/',
  '/sub-category/'
];

var publicPages = [
  '/account/signup',
  '/account/login',
  '/account/reset-password'
];

firebase.auth().onAuthStateChanged(function (user) {
  var currentPath = window.location.pathname;
  if (user) {
    // User is signed in.
    if (publicPages.includes(currentPath)) {
      window.location.replace('/members-club');
    } else {
      console.log('user is logged in!');
      console.log('Email: ' + user.email);
      console.log('UID: ' + user.uid);
      loginLink.style.display = 'none';
    }
  } else {
    // User is signed out.
    if (privatePages.includes(currentPath)) {
      window.location.replace('/account/login');
    } else {
        console.log('no user is logged in');
        accountLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }    
  }
});

//Run the initApp() function as soon as the page loads
    window.addEventListener('load', function () {
        initApp()
    });
    
//Sets all the inputs on the Profile page
    initApp = function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // Pass the email address to the email-address input on the Profile page, but if email is undefined just pass an empty string
                document.getElementById('updateEmail').value = (user.email == null) ? "" : user.email;

                //Get the authenticated user's UserId
                var uid = firebase.auth().currentUser.uid;

                firebase.database().ref().child('users/' + uid).once('value', function (snapshot) {
                    if (snapshot.val() !== null) {
                        var ref = firebase.database().ref().child('users/' + uid);
                        ref.on("value", function (snapshot) {

                            //Get the user's custom info if it exits and pass it to the correct input in the HTML. Pass an empty string if the custom data does not exist                              
                            document.getElementById('updateFirstName').value = (snapshot.val().firstName == null) ? "" : snapshot.val().firstName;
                            document.getElementById('updateLastName').value = (snapshot.val().lastName == null) ? "" : snapshot.val().lastName;
                            document.getElementById('updateCompany').value = (snapshot.val().company == null) ? "" : snapshot.val().company;
                            document.getElementById('updatePhone').value = (snapshot.val().phone == null) ? "" : snapshot.val().phone;
                            document.getElementById('updateAddress').value = (snapshot.val().address == null) ? "" : snapshot.val().address;
                            document.getElementById('updateCity').value = (snapshot.val().city == null) ? "" : snapshot.val().city;
                            document.getElementById('updateState').value = (snapshot.val().state == null) ? "" : snapshot.val().state;
                            document.getElementById('updateCountry').value = (snapshot.val().country == null) ? "" : snapshot.val().country;
                            document.getElementById('updateZipCode').value = (snapshot.val().zipCode == null) ? "" : snapshot.val().zipCode;
                            
                        }, function (error) {
                            console.log("Error: " + error.code);
                        });
                    }
                });
            }
        }, function (error) {
            console.log(error);
        });
    };
    
    //Allow the user to update their email address and custom profile info
    firebase.auth().onAuthStateChanged(function (user) {
        
        //Allow the user to update their email address
        document.getElementById("updateEmailButton").addEventListener('click', function (event) {
            var email = document.getElementById('updateEmail').value;
            
            if (email == user.email) {
                console.log('Email address is already in use');
                updateEmailError.style.display = 'block';
                updateEmailError.innerHTML = 'This email address is already in use.';
            }
            else {
                console.log(email);
                user.updateEmail(email)
                    .then(function (response) {
                        //Trigger a success message if it works
                        console.log('Email Updated!');
                        document.getElementById('updateEmailButton').innerHTML = 'Email updated!';
                        setTimeout(function(){
    											document.getElementById('updateEmailButton').innerHTML = 'Update Email';
												}, 6000);
                        
                        updateEmailError.style.display = 'none';

                        //Send the user a verification email to their new email address
                        user.sendEmailVerification()
                            .then(function () {
                                console.log("Sent verification email")
                            }).catch(function (error) {
                                console.log("Oops! There was an error.")
                            });

                        //Trigger an error message if it fails
                    }).catch(function (error) {
                        console.log(error);
                    });
            }

        })
        
        //Allow the user to update their password
        document.getElementById("updatePasswordButton").addEventListener('click', function (event) {
            var password = document.getElementById('updateNewPassword').value;
            
            if (password == user.password) {
                console.log('New password must be different than current password.');
                updatePasswordError.style.display = 'block';
                updatePasswordError.innerHTML = 'New password must be different than current password.';
            }
            else {
                console.log('Password updated!');
                user.updatePassword(password)
                    .then(function (response) {
                        //Trigger a success message if it works
                        console.log('Password Updated!');
                        document.getElementById('updatePasswordButton').innerHTML = 'Password updated!';
                        setTimeout(function(){
    											document.getElementById('updatePasswordButton').innerHTML = 'Update Password';
												}, 6000);
                        
                        updatePasswordError.style.display = 'none';
                    })
            }

        })


        //Allow the user to update their custom profile info
        document.getElementById("updateProfileButton").addEventListener('click', function (event) {
            var firstName = document.getElementById('updateFirstName').value;
            var lastName = document.getElementById('updateLastName').value;
            var company = document.getElementById('updateCompany').value;
            var phone = document.getElementById('updatePhone').value;
            var address = document.getElementById('updateAddress').value;
            var city = document.getElementById('updateCity').value;
            var state = document.getElementById('updateState').value;
            var country = document.getElementById('updateCountry').value;
            var zipCode = document.getElementById('updateZipCode').value;
            var uid = firebase.auth().currentUser.uid;

            firebase.database().ref('users/' + uid).update({
                uid: uid,
                firstName: firstName,
                lastName: lastName,
                company: company,
                phone: phone,
                address: address,
                city: city,
                state: state,
                country: country,
                zipCode: zipCode
            })
                //Trigger a success message if it works
                .then(function () {
                    console.log('Profile Updated!');
                     document.getElementById('updateProfileButton').innerHTML = 'Profile Updated!';
                     setTimeout(function(){
    								   document.getElementById('updateProfileButton').innerHTML = 'Update Profile';
										}, 6000);
                })
                //Trigger an error message if it fails
                .catch(function (error) {
                    console.log('Profile update failed.');
                    updateProfileError.style.display = 'block';
                })
        })
        
    })
