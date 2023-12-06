let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
function updateHeader(texte, cmd) {
    $("#header").empty();
    loggedUser = API.retrieveLoggedUser();

    $("#header").append(`
    <span title='${texte}' id='${cmd}Cmd'>
        <img src="images/PhotoCloudLogo.png" class="appLogo">
    </span>
    <span class="viewTitle">${texte}
    </span>
    <div class="headerMenusContainer">
        <span>&nbsp;</span> <!--filler-->
    </div>
    `);

    if (cmd == "listPhotos") {
        $(".viewtitle").append(`
        <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
        `);
    }
    

    if (loggedUser != null) {
        $(".headerMenusContainer").append(`
        <i title="Modifier votre profil">
        <div class="UserAvatarSmall"
            userid="${loggedUser.Id}"
            id="editProfilCmd"
            style="background-image:url('${loggedUser.Avatar}')"
            title="${loggedUser.Name}"></div>
        </i>
        `);

        if (cmd != "editProfil") {
            $("#editProfilCmd").on('click', renderEditProfil);
        }
    }

    $(".headerMenusContainer").append(`
    <div class="dropdown ms-auto dropdownLayout">
        <!-- Articles de menu -->
        <div data-bs-toggle="dropdown" aria-expanded="false">
            <i class="cmdIcon fa fa-ellipsis-vertical"></i>
        </div>
        <div class="dropdown-menu noselect">
            <!--dynamic menu-->
        </div>
    </div>
    `);

    if(loggedUser != null) {
        if (loggedUser.Authorizations == { readAccess: 2, writeAccess: 2 }) {
            $(".dropdown-menu").append(`
            <span class="dropdown-item" id="manageUserCmd">
                <i class="menuIcon fas fa-user-cog mx-2"></i>
                Gestion des usagers
            </span>
            <div class="dropdown-divider"></div>
            `);

            if (cmd != "manageUsers") {
                $("#manageUserCmd").on('click', renderManageUsers);
            }
        }

        $(".dropdown-menu").append(`
        <span class="dropdown-item" id="logoutCmd">
            <i class="menuIcon fa fa-sign-out mx-2"></i>
            Déconnexion
        </span>
        <span class="dropdown-item" id="editProfilCmd">
            <i class="menuIcon fa fa-user-edit mx-2"></i>
            Modifier votre profil </span>
        <div class="dropdown-divider"></div>
        <span class="dropdown-item" id="listPhotosCmd">
            <i class="menuIcon fa fa-image mx-2"></i>
            Liste des photos
        </span>
        <div class="dropdown-divider"></div>
        <span class="dropdown-item" id="sortByDateCmd">
            <i class="menuIcon fa fa-check mx-2"></i>
            <i class="menuIcon fa fa-calendar mx-2"></i>
            Photos par date de création
        </span>
        <span class="dropdown-item" id="sortByOwnersCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-users mx-2"></i>
            Photos par créateur
        </span>
        <span class="dropdown-item" id="sortByLikesCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-user mx-2"></i>
            Photos les plus aiméés </span>
        <span class="dropdown-item" id="ownerOnlyCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-user mx-2"></i>
            Mes photos
        </span>
        `);

        $("#logoutCmd").on('click', API.logout);

        if (cmd != "editProfil") {
            $("#editProfilCmd").on('click', renderEditProfil);
        }

        if(cmd != "listPhotos") {
            $("#listPhotosCmd").on('click', renderListPhotos);
        }

        if (cmd != "sortByDate") {
            $("#sortByDateCmd").on('click', renderSortByDate);
        }

        if(cmd != "sortByOwners") {
            $("#sortByOwnersCmd").on('click', renderSortByOwners);
        }

        if (cmd != "sortByLikes") {
            $("#sortByLikesCmd").on('click', renderSortByLikes);
        }

        if (cmd != "ownerOnly") {
            $("#ownerOnlyCmd").on('click', renderOwnerOnly);
        }
    } else {
        $(".dropdown-menu").append(`
        <span class="dropdown-item" id="loginCmd">
            <i class="menuIcon fa fa-sign-in mx-2"></i>
            Connexion
        </span>
        `);

        $("#loginCmd").on('click', renderLoginForm);
    }

    $(".dropdown-menu").append(`
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="aboutCmd">
        <i class="menuIcon fa fa-info-circle mx-2"></i>
        À propos...
    </span>
    `);

    //$("#loginCmd").on('click', renderAbout);
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...", "about");

    $("#content").append(`
        <div class="aboutContainer">
            <h2>Gestionnaire de photos</h2>
            <hr>
            <p>
                Petite application de gestion de photos multiusagers à titre de démonstration
                d'interface utilisateur monopage réactive.
            </p>
            <p>
                Auteur: Nicolas Chourot
            </p>
            <p>
                Collège Lionel-Groulx, automne 2023
            </p>
        </div>
    `);
}
function renderCreateProfil() {
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    updateHeader("Inscription", "createProfil"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
    $("#content").append(`
        <form class="form" id="createProfilForm"'>
            <fieldset>
                <legend>Adresse ce courriel</legend>
                <input type="email"
                        class="form-control Email"
                        name="Email"
                        id="Email"
                        placeholder="Courriel"
                        required
                        RequireMessage = 'Veuillez entrer votre courriel'
                        InvalidMessage = 'Courriel invalide'
                        CustomErrorMessage ="Ce courriel est déjà utilisé"/>
                <input class="form-control MatchedInput"
                        type="text" matchedInputId="Email"
                        name="matchedEmail"
                        id="matchedEmail"
                        placeholder="Vérification"
                        required
                        RequireMessage = 'Veuillez entrez de nouveau votre courriel'
                        InvalidMessage="Les courriels ne correspondent pas" />
            </fieldset>
            <fieldset>
                <legend>Mot de passe</legend>
                <input type="password"
                        class="form-control"
                        name="Password"
                        id="Password"
                        placeholder="Mot de passe"
                        required
                        RequireMessage = 'Veuillez entrer un mot de passe'
                        InvalidMessage = 'Mot de passe trop court'/>
                <input class="form-control MatchedInput"
                        type="password"
                        matchedInputId="Password"
                        name="matchedPassword"
                        id="matchedPassword"
                        placeholder="Vérification"
                        required
                        InvalidMessage="Ne correspond pas au mot de passe" />
            </fieldset>
            <fieldset>
                <legend>Nom</legend>
                <input type="text"
                        class="form-control Alpha"
                        name="Name"
                        id="Name"
                        placeholder="Nom"
                        required
                        RequireMessage = 'Veuillez entrer votre nom'
                        InvalidMessage = 'Nom invalide'/>
            </fieldset>
            <fieldset>
                <legend>Avatar</legend>
                <div class='imageUploader'
                    newImage='true'
                    controlId='Avatar'
                    imageSrc='images/no-avatar.png'
                    waitingImage="images/Loading_icon.gif">
                </div>
            </fieldset>
            <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
        </form>
        <div class="cancel">
            <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
    `);
    $('#loginCmd').on('click', renderLoginForm); // call back sur clic
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', renderLoginForm); // call back sur clic
    // ajouter le mécanisme de vérification de doublon de courriel
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    // call back la soumission du formulaire
    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#createProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        showWaitingGif(); // afficher GIF d’attente
        createProfil(profil); // commander la création au service API
    });
}
function renderLoginForm() {
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    updateHeader("Connexion", "login"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
    $("#content").append(`
        <h3>${loginMessage}</h3>
        <form class="form" id="loginForm">
            <input type='email'
                    name='Email'
                    class="form-control"
                    required
                    RequireMessage = 'Veuillez entrer votre courriel'
                    InvalidMessage = 'Courriel invalide'
                    placeholder="adresse de courriel"
                    value='${Email}'>
            <span style='color:red'>${EmailError}</span>
            <input type='password'
                    name='Password'
                    placeholder='Mot de passe'
                    class="form-control"
                    required
                    RequireMessage = 'Veuillez entrer votre mot de passe'>
            <span style='color:red'>${passwordError}</span>
            <input type='submit'
                    name='submit'
                    value="Entrer"
                    class="form-control btn-primary">
        </form>
        <div class="form">
            <hr>
            <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
        </div>
    `);
    $('#createProfilCmd').on('click', renderCreateProfil); // call back sur clic
    initFormValidation();
    // call back la soumission du formulaire
    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#loginForm'));
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        showWaitingGif(); // afficher GIF d’attente
        login(profil.Email, profil.Password); // commander la création au service API
    });
}
function renderEditProfil() {
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    updateHeader("Profil", "editProfil"); // mettre à jour l’entête et menu
    loggedUser = API.retrieveLoggedUser();
    $("#content").append(`
    <form class="form" id="editProfilForm"'>
        <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
        <fieldset>
            <legend>Adresse ce courriel</legend>
            <input type="email"
                    class="form-control Email"
                    name="Email"
                    id="Email"
                    placeholder="Courriel"
                    required
                    RequireMessage = 'Veuillez entrer votre courriel'
                    InvalidMessage = 'Courriel invalide'
                    CustomErrorMessage ="Ce courriel est déjà utilisé" value="${loggedUser.Email}" >
            <input class="form-control MatchedInput"
                    type="text"
                    matchedInputId="Email"
                    name="matchedEmail"
                    id="matchedEmail"
                    placeholder="Vérification"
                    required
                    RequireMessage = 'Veuillez entrez de nouveau votre courriel'
                    InvalidMessage="Les courriels ne correspondent pas"
                    value="${loggedUser.Email}" >
        </fieldset>
        <fieldset>
            <legend>Mot de passe</legend>
            <input type="password"
                    class="form-control"
                    name="Password"
                    id="Password"
                    placeholder="Mot de passe"
                    InvalidMessage = 'Mot de passe trop court' >
            <input class="form-control MatchedInput"
                    type="password"
                    matchedInputId="Password"
                    name="matchedPassword"
                    id="matchedPassword"
                    placeholder="Vérification"
                    InvalidMessage="Ne correspond pas au mot de passe" >
        </fieldset>
        <fieldset>
            <legend>Nom</legend>
            <input type="text"
                    class="form-control Alpha"
                    name="Name"
                    id="Name"
                    placeholder="Nom"
                    required
                    RequireMessage = 'Veuillez entrer votre nom'
                    InvalidMessage = 'Nom invalide'
                    value="${loggedUser.Name}" >
        </fieldset>
        <fieldset>
            <legend>Avatar</legend>
            <div class='imageUploader'
                newImage='false'
                controlId='Avatar'
                imageSrc='${loggedUser.Avatar}'
                waitingImage="images/Loading_icon.gif">
            </div>
        </fieldset>
        <input type='submit'
                name='submit'
                id='saveUserCmd'
                value="Enregistrer"
                class="form-control btn-primary">
    </form>
    <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>
    <div class="cancel"> <hr>
        <a href="confirmDeleteProfil.php">
            <button class="form-control btn-warning">Effacer le compte</button>
        </a>
    </div>
    `);
    $('#createProfilCmd').on('click', renderCreateProfil); // call back sur clic
    initFormValidation();
    // call back la soumission du formulaire
    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#loginForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        showWaitingGif(); // afficher GIF d’attente
        modifyUserProfil(profil); // commander la modification au service API
    });
}
function renderManageUsers() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Gestion des usagers", "manageUsers");

    $("#content").append(`
        <div class="UserRow">
            <!--Users here-->
        </div>
    `);

    let accounts = API.GetAccounts();

    accounts.forEach(account => {
        $(".UserRow").append(`
            <div class="UserContainer">
                <div class="UserLayout">
                    <div class="UserAvatar"
                        userid="${account.Id}"
                        style="background-image:url('${account.Avatar}')"
                        title="${account.Name}"></div>
                    <div class="UserInfo">
                        <div class="UserName">
                            ${account.Name}
                        </div>
                        <div class="UserEmail">
                            ${account.Email}
                        </div>
                    </div>
                </div>
                <div class="UserCommandPanel">
                    <!--User commands here-->
                </div>
            </div>
        `);

        if (account.Authorizations == { readAccess: 2, writeAccess: 2 }) {
            $(".UserCommandPanel").append(`
                <div class="fas fa-user-cog" data-user-id="${account.Id}"
                    title="Administrateur / retirer les droits administrateur"></div>
                <div class="fa-regular fa-circle greenCmd" data-user-id="${account.Id}"
                    title="Usager non bloqué / bloquer l'accès"></div>
            `);
        } else {
            $(".UserCommandPanel").append(`
                <div class="fas fa-user-alt" data-user-id="${account.Id}"
                    title="Usager / promouvoir administrateur"></div>
            `);

            if (account.Authorizations.writeAccess == 1) {
                $(".UserCommandPanel").append(`
                    <div class="fa-regular fa-circle greenCmd" data-user-id="${account.Id}"
                    title="Usager non bloqué / bloquer l'accès"></div>
                `);
            } else {
                $(".UserCommandPanel").append(`
                    <div class="fa fa-ban redCmd" data-user-id="${account.Id}"
                    title="Usager bloqué / débloquer l'accès"></div>
                `);
            }
        }

        $(".UserCommandPanel").append(`
            <div class="fas fa-user-slash goldenrodCmd" data-user-id="${account.Id}"
                title="Effacer l'usager"></div>
        `);
    });

    $(".fa-user-cog").on('click', function() {
        // retirer les droits administrateur
    });
    $(".fa-user-alt").on('click', function() {
        // promouvoir administrateur
    });
    $(".fa-circle").on('click', function() {
        // bloquer l'accès
    });
    $(".fa-ban").on('click', function() {
        // débloquer l'accès
    });
    $(".fa-user-slash").on('click', function() {
        // Effacer l'usager
    });
    // this.data("user-id");
}
function renderListPhotos() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...", "about");

    $("#content").append(`
        <div class="aboutContainer">
            <h2>Gestionnaire de photos</h2>
            <hr>
            <p>
                Petite application de gestion de photos multiusagers à titre de démonstration
                d'interface utilisateur monopage réactive.
            </p>
            <p>
                Auteur: Nicolas Chourot
            </p>
            <p>
                Collège Lionel-Groulx, automne 2023
            </p>
        </div>
    `);
}
function renderSortByDate() {

}
function renderSortByOwners() {

}
function renderSortByLikes() {

}
function renderOwnerOnly() {

}
