import { Component, OnInit, Input } from '@angular/core';
import { Utilisateur, UtilisateurRole } from 'src/app/Model/Utilisateur';
import { UtilisateurService } from 'src/app/Service/utilisateur.service';
import { Router } from '@angular/router';
import { Adresse } from 'src/app/Model/Adresse';
import { AdresseService } from 'src/app/Service/adresse.service';
import { FormGroup } from '@angular/forms';
import { Erreurs } from 'src/app/Erreurs';
import { ok } from 'assert';

@Component({
  selector: 'app-utilisateurs-details',
  templateUrl: './utilisateurs-details.component.html',
  styleUrls: ['./utilisateurs-details.component.css']
})
export class UtilisateursDetailsComponent implements OnInit {

  @Input() utilisateur: Utilisateur;
  @Input() adresse: Adresse;
  @Input() editUtilisateur: FormGroup;
  @Input() editAdresse: FormGroup;
  @Input() editRole: FormGroup;

  utilisateurForm: Utilisateur;
  adresseForm: Adresse;
  utilisateurRoleForm: UtilisateurRole;

  constructor(
    private utilisateurService: UtilisateurService,
    private adresseService: AdresseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.utilisateur = new Utilisateur();
    this.adresse = new Adresse();
  }

  remplirUtilisateurForm(): void {
    this.utilisateurForm = new Utilisateur();
    this.utilisateurForm.id = this.utilisateur.id;
    this.utilisateurForm.nom = this.editUtilisateur.get("nom").value;
    this.utilisateurForm.prenom = this.editUtilisateur.get("prenom").value;
    this.utilisateurForm.dateNaissance = this.editUtilisateur.get("dateNaissance").value;
    this.utilisateurForm.mail = this.editUtilisateur.get("mail").value;
    if(this.editUtilisateur.get("telephone").value == 0 || this.editUtilisateur.get("telephone").value == null)
      this.utilisateurForm.telephone = null;
    else
      this.utilisateurForm.telephone = +this.editUtilisateur.get("telephone").value;
    this.utilisateurForm.gsm = +this.editUtilisateur.get("gsm").value;
    this.utilisateurForm.username = this.editUtilisateur.get("username").value;
    //this.utilisateurForm.motDePasse = this.utilisateur.motDePasse;
    //this.utilisateurForm.motDePasseConf = this.utilisateur.motDePasse;
    this.utilisateurForm.rowVersion = this.utilisateur.rowVersion;


    this.utilisateurRoleForm = new UtilisateurRole();
    if(this.utilisateur.utilisateurRole.length == 0)
    {
      if(this.editRole.get("admin").value) {
        this.utilisateurRoleForm.idRole = "admin";
        this.utilisateurRoleForm.idUtilisateur = this.utilisateur.id;
        this.utilisateurService.ajouterUtilisateurRole(this.utilisateurRoleForm).subscribe();
      }
    }
    else
    {
      var estAdmin: boolean;
      for(var i = 0; i < this.utilisateur.utilisateurRole.length; i++)
      {
        if(!estAdmin && this.utilisateur.utilisateurRole[i].idRole == "admin")
          estAdmin = true;
      }
      if(this.editRole.get("admin").value && !estAdmin)
      {
        this.utilisateurRoleForm.idRole = "admin";
        this.utilisateurRoleForm.idUtilisateur = this.utilisateur.id;
        this.utilisateurService.ajouterUtilisateurRole(this.utilisateurRoleForm).subscribe();
      }
      if(!this.editRole.get("admin").value && estAdmin)
      {
        this.utilisateurRoleForm.idRole = "admin";
        this.utilisateurRoleForm.idUtilisateur = this.utilisateur.id;
        this.utilisateurService.supprimerUtilisateurRole(this.utilisateurRoleForm).subscribe();
      }
    }

    this.remplirAdresseForm();
  }

  remplirAdresseForm() {
    this.adresseForm = new Adresse();
    
    //Si l'adresse est inchangée
    if(this.adresse.rue.toLocaleLowerCase() == this.editAdresse.get("rue").value.toLocaleLowerCase() &&
    this.adresse.numero == this.editAdresse.get("numero").value &&
    this.adresse.localite.toLocaleLowerCase() == this.editAdresse.get("localite").value.toLocaleLowerCase() &&
    this.adresse.codePostal == this.editAdresse.get("codePostal").value &&
    this.adresse.pays.toLocaleLowerCase() == this.editAdresse.get("pays").value.toLocaleLowerCase())
    {
      this.utilisateurForm.adresse = this.utilisateur.adresse;
      this.modifierUtilisateur();
    }
    else
    {
      //Si l'adresse a été modifiée
      this.adresseForm.rue = this.editAdresse.get("rue").value;
      this.adresseForm.numero = this.editAdresse.get("numero").value;
      this.adresseForm.localite = this.editAdresse.get("localite").value;
      this.adresseForm.codePostal = this.editAdresse.get("codePostal").value;
      this.adresseForm.pays = this.editAdresse.get("pays").value;
      this.ajouterAdresse();
    }
  }

  modifierUtilisateur() {
    this.utilisateurService.modifierUtilisateur(this.utilisateurForm).subscribe(elem => {
      alert("Utilisateur modifié ! ");
      this.reloadPage();
    },
    error => {
      this.gestionErreur(error.status);
    });
  }

  ajouterAdresse() {
    this.adresseService.ajouterAdresse(this.adresseForm).subscribe(elem => {
      this.utilisateurForm.adresse = elem.id;
      this.modifierUtilisateur();
    },
    error => {
      Erreurs.gestionErreur(error.status);
    });
  }

  suppressionUtilisateur(utilisateur: Utilisateur) {
    if(confirm("Voulez-vous supprimer cet utilisateur ? " + utilisateur.nom + " " + utilisateur.prenom)) {
      this.utilisateurService.supprimerUtilisateur(utilisateur).subscribe(elem => {
        this.reloadPage();
      },
      error => {
        Erreurs.gestionErreur(error.status);
      });
    }
  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/utilisateur']);
    });
  }
    
  gestionErreur(error: number) {
    if(error == 400)
      alert("Le nom d'utilisateur et/ou l'adresse email existe déjà !");
    else
      Erreurs.gestionErreur(error);
  }

}
