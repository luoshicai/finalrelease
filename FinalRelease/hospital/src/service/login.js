import Ajax from '@ra-lib/ajax';

const ajax = new Ajax();

export function login() {
    return ajax.usePost('/user/login');
}
