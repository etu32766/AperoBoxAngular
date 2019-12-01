import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Box } from '../Model/Box';
import { Constantes } from '../Constantes';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  constructor(private http:HttpClient) { }

  getAllBox(): Observable<Box[]> {
    return this.http.get<Box[]>(`${Constantes.URL_API}Box`);
  }

  getBoxById(id: number): Observable<Box>{
    return this.http.get<Box>(`${Constantes.URL_API}Box/${id}`);
  }
}