import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../Model/Produit';
import { Constantes } from '../Constantes';
import { Box } from '../Model/Box';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  listeProduitQuantite: Array<{produit: Produit, quantite: number}>;
  estTrouve: boolean;

  constructor(private http:HttpClient, private authenticationService: AuthenticationService) { 
    this.listeProduitQuantite = new Array();
  }

  getAllProduit(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${Constantes.URL_API}Produit`);
  }

  completeListeProduitQuantite(produits: Produit[], box?: Box) {
    this.listeProduitQuantite.length = 0;

    if(box==null){
      produits.forEach(prod => {
          this.listeProduitQuantite.push({produit: prod, quantite: 0})
      });
    }
    else {
      produits.forEach(prod => {
        this.estTrouve = false;
        prod.ligneProduit.forEach(lp => {
          if(lp.box == box.id)
          {
            this.listeProduitQuantite.push({produit: prod, quantite: lp.quantite});
            this.estTrouve = true;
          }
        });
        if(!this.estTrouve) {
          this.listeProduitQuantite.push({produit: prod, quantite: 0})
        }
      });
    }
    
  }
  
}