<div ng-if="$ctrl.error == 'error'" class="alert alert-danger">
    Benutzername oder Passwort falsch. Bitte erneut versuchen...
</div>
<form method="post" ACTION="j_security_check">

    <label class="sr-only">Login</label>
    <input class="form-control" required="required" type="text" name="j_username"/>

    <label class="sr-only">Password</label>
    <input id="password" class="form-control" required="required" type="password" name="j_password"/>

    <button type="submit" name="login" class="btn btn-lg btn-primary btn-block" ng-disabled="form.$invalid">Login</button>
</form>