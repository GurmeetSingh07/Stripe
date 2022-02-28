module.exports=function order(code,i,j)

{
	 var length=code.toString().length;

	for(length;length<i;length++)
	{
		code=`${j}${code}`
			
	}
	return code
}