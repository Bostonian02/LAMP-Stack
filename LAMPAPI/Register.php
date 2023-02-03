
<?php

	$inData = getRequestInfo();
	
	$id = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Set up SQL statement
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES( ?, ?, ?, ?)");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();
		$last_id = $conn->insert_id;

		if( $last_id = $conn->insert_id ){
			returnWithInfo( $last_id, $inData["firstName"], $inData["lastName"]);
		}
		else{
			returnWithError("Cant Fetch ID");
		}
		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $first, $last)
	{
		// If return with an id > 0, user has been created
		$retValue = '{"id":'.$id.',"error":"", "firstName":"'.$first.'", "lastName":"'.$last.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
