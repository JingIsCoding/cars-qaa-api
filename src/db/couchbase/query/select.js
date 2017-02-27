const AND = "AND"
const OR = "OR"
const NOT = "NOT"

class Join{
    constructor(type, select, bucketName){
        this.type = type;
        this.bucketName = bucketName
        this.select = select
    }

    onKey(field){
        this.keyField = field;
        return this;
    }

    onKeys(field){
        this.keysField = field;
        return this.select
    }

    for(type){
        this.forType = type
        return this.select
    }
}

class Nest{
    constructor(type, select, bucketName, direction= "INNER"){
        this.direction = direction
        this.type = type;
        this.bucketName = bucketName
        this.select = select
    }

    onKey(field){
        this.keyField = field;
        return this;
    }

    onKeys(field){
        this.keysField = field;
        return this.select
    }

    for(type){
        this.forType = type
        return this.select
    }
}

class Where{
    constructor(condition){
        this.conditions = [{
            condition
        }];
    }

    addAnd(condition){
        this.conditions.push({
            operator: AND,
            condition
        })
    }

    addOr(condition){
        this.conditions.push({
            operator: OR,
            condition
        })
    }

    addNot(condition){
        this.conditions.push({
            operator: NOT,
            condition
        })
    }
}

class Condition{
    constructor(field, select){
        this.field = field;
        this.select = select
    }

    greaterThan(value){
        this.comparator = ">";
        this.value = value;
        return this.select
    }

    lessThan(value){
        this.comparator = "<";
        this.value = value;
        return this.select;
    }

    equals(value){
        this.comparator = "=";
        this.value = value;
        return this.select;
    }

    has(value){
        this.comparator = "IN";
        this.value = value;
        return this.select;
    }

    hasEvery(array){
        this.isArray = true
        this.comparator = "EVERY";
        this.value = eval(array);
        return this.select;
    }

    hasAny(array){
        this.isArray = true
        this.comparator = "ANY";
        this.value = array;
        return this.select;
    }

    containsString(value){
        this.isFunc = true
        this.comparator = "CONTAINS";
        this.value = value;
        return this.select;
    }
}


export default class Select{
    constructor(bucketName){
        this.bucketName = bucketName
        this.attributes = [];
        this.orderBys = [];
    }

    onType(type){
        this.type = type;
        return this;
    }

    with(attribute, as){
        this.attributes.push({
            attribute,
            as: as ? as : attribute
        });
        return this
    }

    join(type, bucketName){
        const joinObj = new Join(type, this, bucketName)
        this.joinObj = joinObj
        return joinObj
    }

    leftOuterNest(type, bucketName){
        this.nestObj = new Nest(type, this, bucketName, "LEFT OUTER")
        return this.nestObj
    }

    leftNest(type, bucketName){
        this.nestObj = new Nest(type, this, bucketName, "LEFT")
        return this.nestObj
    }

    nest(type, bucketName){
        this.nestObj = new Nest(type, this, bucketName, "INNER")
        return this.nestObj
    }

    that(field){
        const condition = new Condition(field, this)
        this.where = new Where(condition)
        condition.where = this.where
        return condition
    }

    andThat(field){
        if (!this.where){
            console.error("User that(field) first")
        }
        const condition = new Condition(field, this)
        this.where.addAnd(condition)
        return condition
    }

    orThat(field){
        if (!this.where){
            console.error("User that(field) first")
        }
        const condition = new Condition(field, this)
        this.where.addOr(condition)
        return condition
    }

    notThat(field){
        if (!this.where){
            console.error("User that(field) first")
        }
        const condition = new Condition(field, this)
        this.where.addNot(condition)
        return condition
    }

    groupBy(field){
        this.groupByField = field
        return this
    }

    orderBy(field, order){
        this.orderBys.push({
            field,
            order
        })
        return this
    }

    limit(limit){
        this.limitNumber = limit
        return this
    }

    skip(skip){
        this.skipNumber = skip
        return this
    }

    toQueryString(){
        let queryString = "SELECT ";
        let attributesString = '* ';
        if (this.attributes.length > 0){
            attributesString = this.attributes.map(item => item.attribute + " AS "+ item.as).join(', ')
        }
        queryString += attributesString;

        queryString += " FROM " + this.bucketName +" " + this.type

        if (this.joinObj){
            queryString += getJoinString(this.joinObj, this)
        }

        if (this.nestObj) {
            queryString += getNestString(this.nestObj, this)
        }

        queryString += " WHERE " + this.type +".type='" + this.type + "' ";

        if (this.where){
            queryString += "AND ("
            queryString += getConditionString(this.where)
            queryString += ")"
        }

        if (this.groupByField){
            queryString += " GROUP BY " + this.groupByField
        }

        if (this.orderBys.length > 0){
            const orderStrings = this.orderBys.map(orderBy => orderBy.field + " " + orderBy.order).join(', ')
            queryString += " ORDER BY " + orderStrings
        }

        if (this.limitNumber){
            queryString += " LIMIT " + this.limitNumber
        }

        if (this.skipNumber){
            queryString += " OFFSET " + this.skipNumber
        }

        return queryString;
    }
}

function getNestString(nestObj, select) {
    const bucketName = nestObj.bucketName ? nestObj.bucketName : select.bucketName
    let joinString = " " + nestObj.direction + " Nest " + bucketName + " " + nestObj.type
    if (nestObj.keyField){
        joinString += " ON KEY " + nestObj.keyField + " FOR " + nestObj.forType
    } else {
        joinString += " ON KEYS " + nestObj.keysField
    }
    return joinString
}

function getJoinString(join, select) {
    const bucketName = join.bucketName ? join.bucketName : select.bucketName
    let joinString = " JOIN " + bucketName + " " + join.type
    if (join.keyField){
        joinString += " ON KEY " + join.keyField + " FOR " + join.forType
    } else {
        joinString += " ON KEYS " + join.keysField
    }
    return joinString
}

function getConditionString(where) {
    const conditionStrings = where.conditions.map(item => {
        let conditionString = ""
        if (item.operator){
            conditionString += item.operator + " "
        }
        const condition = item.condition
        if (condition.isFunc){
            conditionString += condition.comparator + "(" + condition.field + "," + toString(condition.value) +")"
        } else if (condition.comparator === 'IN'){
            conditionString += " " + toString(condition.value) + " " + condition.comparator + " " + condition.field
        } else if (condition.isArray){
            conditionString += " " + condition.comparator + " item IN " + toString(condition.value) + " SATISFIES item IN " + condition.field + " END "
        } else {
            conditionString += " " + condition.field + " " + condition.comparator + " " + toString(condition.value)
        }
        return conditionString
    })

    return conditionStrings.join(' ')
}

function toString(value) {
    if (typeof value === 'string'){
        return '"' + value +'"'
    } else if (typeof value === 'object'){
        return JSON.stringify(value)
    } else {
        return value
    }
}