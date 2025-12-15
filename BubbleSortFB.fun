FUNCTION_BLOCK BubbleSortFB
VAR_INPUT
    Execute : BOOL;
    Reset : BOOL;
    ArrayIn : ARRAY[0..99] OF UDINT;
    Size : UDINT;
END_VAR
VAR_OUTPUT
    Status : INT;
    ErrorCode : INT;
END_VAR
VAR
    i : UDINT;
    j : UDINT;
    temp : UDINT;
    Sorting : BOOL := FALSE;
END_VAR
END_FUNCTION_BLOCK
