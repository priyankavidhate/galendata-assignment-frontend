import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY } from 'rxjs'

let SERVER_URL = 'http://localhost:8080';

export function EventServer() {
    return {
        getData: function (request, http: HttpClient, gridApi) {
            let url = SERVER_URL + '/GalenAssignment/rest/events?' + 'limit=' + getLimit(request) + '&offset=' + getOffset(request);
            let sortPart = getSort(request);
            if(sortPart) {
                url += '&sort=' + sortPart
            }
            let filterPart = getFilters(request);
            if(filterPart === '') {
                return EMPTY;
            } else if(filterPart) {
                url += '&filter=' + filterPart
            }
            console.log('url :', url)
            return http.get(url)
        },
        getAllLocations(http: HttpClient) {
            let url = SERVER_URL + '/GalenAssignment/rest/locations'
            return http.get(url)
        }
    };
  }

  function getLimit(request) {
    var blockSize = request.endRow - request.startRow;
    return blockSize
  }

  function getOffset(request) {
      return request.startRow;
  }

  function getSort(request) {
      if(request.sortModel && request.sortModel.length > 0) {
          return request.sortModel[0].colId + "-" + request.sortModel[0].sort
      }
      return null;
  }

  function getFilters(request) {

    if(request.filterModel && request.filterModel.location && request.filterModel.location.values.length > 0) {
        console.log('getFilters :', SetToString(request.filterModel.location.values, ';'))
        return SetToString(request.filterModel.location.values, ';')
    }
    if(request.filterModel && request.filterModel.location && request.filterModel.location.values == 0) {
        return '';
    }
    return null;
  }

  function SetToString(set, delim){
    let str = '';
    set.forEach(function(elem){
        if(elem)
          str += elem + delim
    });
    return str
  }
