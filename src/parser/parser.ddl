DDL = 
  CreateTable table_name:(TableName) LeftPara column_defs:(ColumnDefs) RightPara primary_key:(PrimaryKey?) Semi?  {
    return {
      table_name,
      column_defs,
      primary_key
    }
  }
  
PrimaryKey = _ "PRIMARY" _ "KEY" _ "(" [a-zA-Z0-9_]+ ")" _ {
	return text()
}

CreateTable = 
  _ "create"i _ "table"i _ 

Identity = 
  _ identity:([a-zA-Z][0-9a-zA-Z_]+) _ {
    return [
      identity[0],
      ...(identity.length === 2 ? identity[1] : [])
    ].join('')
  }

TableName = Identity


ColumnDef = 
  _ name:(Identity) type:(Type) _ {
    return {
      name,
      type
    }
  }

ColumnDefs = 
  head:((ColumnDef _ Comma)*) tail:(ColumnDef?) _ {
    return [
      ...head.map(item => item[0]),
      ...(tail ? [tail] : [])
    ]
  }


Type = t:([A-Za-z0-9\(\)_<>= ])+ {
	return t.join('')
}

Options = 
  _ "OPTIONS"i  LeftPara  "allow_commit_timestamp"  Equal  allow_commit_timestamp:("true"/"null")  RightPara _ {
    return {
      allow_commit_timestamp: Boolean(allow_commit_timestamp)
    }
  }

Comment = 
  _ ShortBar ShortBar _ comment:([^\n]+) {
  return comment.join('')
}

LeftPara = _ "(" _
RightPara = _ ")" _
Semi = _ ";" _
Comma = _ "," _
Equal = _ "=" _
ShortBar = _ "-" _

WhiteSpace = 
  [ \r\n\t]

_ = 
  WhiteSpace* {
    return null
  }