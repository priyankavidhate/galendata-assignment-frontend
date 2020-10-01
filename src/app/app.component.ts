import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import { EventServer } from './Server/EventServer'
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  gridApi;
  gridColumnApi;

  columnDefs;
  defaultColDef;
  rowModelType;
  paginationPageSize;
  cacheBlockSize;
  rowData: [];
  http2;

  constructor(private http: HttpClient) {
    this.http2 = http
    this.defaultColDef = {
      flex: 1,
      minWidth: 200,
      resizable: true,
    };
    this.rowModelType = 'serverSide';
    this.paginationPageSize = 10;
    this.cacheBlockSize = 10;
  }

  onGridReady(params) {

    this.columnDefs = [
      {
        field: 'name',
      },
      {
        field: 'website',
      },
      {
        field: 'startdate',
        sortable: true,
      },
      {
        field: 'enddate'
      },
      {
        field: 'location',
        filter: 'agSetColumnFilter',
        sortable: true,
      },
    ];
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.columnDefs[4].filterParams = {
      values : (params) => {
        EventServer().getAllLocations(this.http2).subscribe((response) => {
          params.success(response['location']);
        })
      }
    }
    var datasource = ServerSideDatasource(EventServer(), this.http2, this.gridApi);
    params.api.setServerSideDatasource(datasource);
  }
}

function ServerSideDatasource(server, http:HttpClient, gridApi) {
  return {
    getRows: function (params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      server.getData(params.request, http, gridApi).subscribe((response) => {
        console.log('response: ', response);
        const result = {
          success: true,
          rows: response,
          lastRow: getLastRowIndex(params.request, response),
        };
        setTimeout(function () {
          if (result.success) {
            params.successCallback(result.rows, response.lastRow);
          } else {
            params.failCallback();
          }
        }, 200);
      });
    },
  };
}

function getLastRowIndex(request, results) {
  if (!results || results.length === 0) {
    return request.startRow;
  }
  var currentLastRow = request.startRow + results.length;
  return currentLastRow <= request.endRow ? currentLastRow : -1;
}
