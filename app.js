// Data structure
const codeSmells = {
  general: {
    bloaters: [
      {
        name: 'Long Method',
        workshop: true,
        sessionCovered: 1,
        brief: 'A method that has grown too large and does too many things',
        indicators: [
          'Methods longer than 10-15 lines',
          'Multiple levels of abstraction',
          'Hard to understand at a glance',
          'Difficult to reuse parts of the method'
        ],
        pythonBad: `# BAD: Long method doing too much
def process_order(order_data):
    # Validate order
    if not order_data.get('customer_id'):
        raise ValueError("Missing customer ID")
    if not order_data.get('items'):
        raise ValueError("No items in order")
    
    # Calculate totals
    subtotal = 0
    for item in order_data['items']:
        subtotal += item['price'] * item['quantity']
    
    tax_rate = 0.08
    tax = subtotal * tax_rate
    shipping = 10.0 if subtotal < 50 else 0
    total = subtotal + tax + shipping
    
    # Apply discounts
    if order_data.get('coupon_code'):
        if order_data['coupon_code'] == 'SAVE10':
            total *= 0.9
        elif order_data['coupon_code'] == 'SAVE20':
            total *= 0.8
    
    # Save to database
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO orders VALUES (?, ?)",
        (order_data['customer_id'], total)
    )
    db.commit()
    return total`,
        pythonGood: `# GOOD: Extracted into focused methods
def process_order(order_data):
    validate_order(order_data)
    total = calculate_total(order_data)
    order_id = save_order(order_data, total)
    return order_id

def validate_order(order_data):
    if not order_data.get('customer_id'):
        raise ValueError("Missing customer ID")
    if not order_data.get('items'):
        raise ValueError("No items in order")

def calculate_total(order_data):
    subtotal = calculate_subtotal(order_data['items'])
    tax = calculate_tax(subtotal)
    shipping = calculate_shipping(subtotal)
    total = subtotal + tax + shipping
    return apply_discount(total, order_data.get('coupon_code'))

def calculate_subtotal(items):
    return sum(i['price'] * i['quantity'] for i in items)

def apply_discount(total, coupon):
    discounts = {'SAVE10': 0.1, 'SAVE20': 0.2}
    discount = discounts.get(coupon, 0)
    return total * (1 - discount)`,
        fixSteps: [
          'Identify distinct responsibilities in the method',
          'Extract each responsibility into a separate method',
          'Give each method a descriptive name',
          'Keep each method at a single level of abstraction',
          'Ensure methods are 5-10 lines maximum'
        ],
        techniques: ['Extract Method', 'Replace Temp with Query', 'Introduce Parameter Object']
      },
      {
        name: 'Large Class',
        workshop: true,
        sessionCovered: 1,
        brief: 'A class trying to do too much with too many fields and methods',
        indicators: [
          'Class has 20+ methods or 10+ fields',
          'Low cohesion among methods',
          'Difficult to understand class purpose',
          'Multiple reasons to change the class'
        ],
        pythonBad: `# BAD: God class doing everything
class OrderManager:
    def __init__(self):
        self.orders = []
        self.customers = []
        self.products = []
        self.inventory = {}
    
    def add_customer(self, customer):
        self.customers.append(customer)
    
    def get_customer(self, customer_id):
        return next((c for c in self.customers 
                   if c['id'] == customer_id), None)
    
    def add_product(self, product):
        self.products.append(product)
    
    def update_inventory(self, product_id, qty):
        self.inventory[product_id] = qty
    
    def create_order(self, customer_id, items):
        # Order creation logic...
        pass
    
    def calculate_shipping(self, order):
        # Shipping logic...
        pass`,
        pythonGood: `# GOOD: Separated into focused classes
class CustomerRepository:
    def __init__(self):
        self.customers = []
    
    def add(self, customer):
        self.customers.append(customer)
    
    def get_by_id(self, customer_id):
        return next((c for c in self.customers 
                   if c['id'] == customer_id), None)

class ProductRepository:
    def __init__(self):
        self.products = []
    
    def add(self, product):
        self.products.append(product)

class InventoryManager:
    def __init__(self):
        self.inventory = {}
    
    def update(self, product_id, quantity):
        self.inventory[product_id] = quantity

class OrderService:
    def __init__(self, customer_repo, product_repo):
        self.customer_repo = customer_repo
        self.product_repo = product_repo
        self.orders = []`,
        fixSteps: [
          'Identify groups of related fields and methods',
          'Extract each group into a separate class',
          'Use composition to connect classes',
          'Apply Single Responsibility Principle',
          'Consider using design patterns (Repository, Service)'
        ],
        techniques: ['Extract Class', 'Extract Subclass', 'Extract Interface']
      },
      {
        name: 'Long Parameter List',
        workshop: true,
        sessionCovered: 1,
        brief: 'A method with more than 3-4 parameters',
        indicators: [
          'Methods with 4+ parameters',
          'Difficulty understanding method calls',
          'Parameters that always travel together'
        ],
        pythonBad: `# BAD: Too many parameters
def create_user(first_name, last_name, email, 
               phone, address, city, state, 
               zip_code, country):
    user = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone': phone,
        'address': address,
        'city': city,
        'state': state,
        'zip': zip_code,
        'country': country
    }
    save_to_db(user)`,
        pythonGood: `# GOOD: Use parameter object
from dataclasses import dataclass

@dataclass
class UserProfile:
    first_name: str
    last_name: str
    email: str
    phone: str

@dataclass
class Address:
    street: str
    city: str
    state: str
    zip_code: str
    country: str

def create_user(profile: UserProfile, 
               address: Address):
    user = {
        **profile.__dict__,
        **address.__dict__
    }
    save_to_db(user)`,
        fixSteps: [
          'Group related parameters into objects',
          'Create data classes or named tuples',
          'Pass objects instead of individual values',
          'Consider using keyword arguments'
        ],
        techniques: ['Introduce Parameter Object', 'Preserve Whole Object']
      },
      {
        name: 'Data Clumps',
        workshop: true,
        sessionCovered: 1,
        brief: 'Groups of variables that always appear together',
        indicators: [
          'Same parameters in multiple methods',
          'Same fields in multiple classes',
          'Data that travels together'
        ],
        pythonBad: `# BAD: Repeated parameter groups
def calculate_distance(x1, y1, x2, y2):
    return ((x2-x1)**2 + (y2-y1)**2)**0.5

def get_midpoint(x1, y1, x2, y2):
    return ((x1+x2)/2, (y1+y2)/2)

def draw_line(canvas, x1, y1, x2, y2):
    canvas.line(x1, y1, x2, y2)`,
        pythonGood: `# GOOD: Extract into a class
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    
    def distance_to(self, other):
        return ((other.x - self.x)**2 + 
               (other.y - self.y)**2)**0.5
    
    def midpoint_to(self, other):
        return Point(
            (self.x + other.x) / 2,
            (self.y + other.y) / 2
        )

def draw_line(canvas, start: Point, end: Point):
    canvas.line(start.x, start.y, end.x, end.y)`,
        fixSteps: [
          'Identify groups of data that appear together',
          'Create a class to encapsulate the group',
          'Replace parameter lists with the new object',
          'Move related behavior into the new class'
        ],
        techniques: ['Extract Class', 'Introduce Parameter Object']
      },
      {
        name: 'Primitive Obsession',
        workshop: true,
        sessionCovered: 1,
        brief: 'Using primitives instead of small objects for simple tasks',
        indicators: [
          'Type codes or status strings',
          'Validation logic scattered everywhere',
          'Magic numbers and strings'
        ],
        pythonBad: `# BAD: Using primitives for domain concepts
def process_payment(amount, currency_code):
    if currency_code == 'USD':
        fee = amount * 0.029
    elif currency_code == 'EUR':
        fee = amount * 0.035
    else:
        raise ValueError("Invalid currency")
    return amount + fee

def format_price(amount, currency_code):
    if currency_code == 'USD':
        return f"\${amount:.2f}"
    elif currency_code == 'EUR':
        return f"€{amount:.2f}"`,
        pythonGood: `# GOOD: Use value objects
from dataclasses import dataclass

@dataclass
class Money:
    amount: float
    currency: str
    
    def processing_fee(self):
        rates = {'USD': 0.029, 'EUR': 0.035}
        if self.currency not in rates:
            raise ValueError("Invalid currency")
        return Money(
            self.amount * rates[self.currency],
            self.currency
        )
    
    def __str__(self):
        symbols = {'USD': '\$', 'EUR': '€'}
        symbol = symbols.get(self.currency, '')
        return f"{symbol}{self.amount:.2f}"

def process_payment(money: Money):
    return money.amount + money.processing_fee().amount`,
        fixSteps: [
          'Identify primitive types representing domain concepts',
          'Create value objects for each concept',
          'Move related behavior into the value object',
          'Replace primitives with value objects throughout code'
        ],
        techniques: ['Replace Data Value with Object', 'Replace Type Code with Class']
      }
    ],
    objectOrientationAbusers: [
      {
        name: 'Switch Statements',
        brief: 'Complex switch or if-else chains that should use polymorphism',
        indicators: [
          'Switch on type code',
          'Same switch logic duplicated',
          'Adding types requires updating switches'
        ],
        pythonBad: `# BAD: Switch on type
def calculate_area(shape):
    if shape['type'] == 'circle':
        return 3.14 * shape['radius'] ** 2
    elif shape['type'] == 'rectangle':
        return shape['width'] * shape['height']
    elif shape['type'] == 'triangle':
        return 0.5 * shape['base'] * shape['height']
    else:
        raise ValueError("Unknown shape")`,
        pythonGood: `# GOOD: Use polymorphism
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return math.pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

def calculate_area(shape: Shape):
    return shape.area()`,
        fixSteps: [
          'Create an abstract base class',
          'Create subclass for each case',
          'Move switch logic into appropriate subclass',
          'Replace switch with polymorphic call'
        ],
        techniques: ['Replace Conditional with Polymorphism', 'Replace Type Code with Subclasses']
      },
      {
        name: 'Temporary Field',
        brief: 'Instance variables only set in certain circumstances',
        indicators: [
          'Fields that are sometimes null',
          'Complex initialization logic',
          'Fields used in only one method'
        ],
        pythonBad: `# BAD: Temporary field pattern
class Order:
    def __init__(self):
        self.items = []
        self.discount_rate = None  # Only used sometimes
    
    def calculate_total(self):
        subtotal = sum(i.price for i in self.items)
        if self.discount_rate:
            return subtotal * (1 - self.discount_rate)
        return subtotal`,
        pythonGood: `# GOOD: Extract to separate class
class Order:
    def __init__(self, items):
        self.items = items
    
    def subtotal(self):
        return sum(i.price for i in self.items)
    
    def calculate_total(self):
        return self.subtotal()

class DiscountedOrder(Order):
    def __init__(self, items, discount_rate):
        super().__init__(items)
        self.discount_rate = discount_rate
    
    def calculate_total(self):
        return self.subtotal() * (1 - self.discount_rate)`,
        fixSteps: [
          'Identify temporary fields',
          'Extract class for the special case',
          'Move field and related methods to new class',
          'Use appropriate class based on situation'
        ],
        techniques: ['Extract Class', 'Introduce Null Object']
      }
    ],
    changePreventers: [
      {
        name: 'Divergent Change',
        brief: 'One class commonly changed for different reasons',
        indicators: [
          'Class changes for multiple reasons',
          'Different types of modifications',
          'Low cohesion'
        ],
        pythonBad: `# BAD: Class with multiple responsibilities
class Report:
    def __init__(self, data):
        self.data = data
    
    def calculate_metrics(self):
        # Changes when calculation logic changes
        pass
    
    def format_as_pdf(self):
        # Changes when PDF format changes
        pass
    
    def send_email(self):
        # Changes when email system changes
        pass`,
        pythonGood: `# GOOD: Separate concerns
class ReportCalculator:
    def calculate_metrics(self, data):
        # Only changes for calculation reasons
        pass

class ReportFormatter:
    def format_as_pdf(self, data):
        # Only changes for formatting reasons
        pass

class ReportEmailer:
    def send_email(self, report):
        # Only changes for email reasons
        pass`,
        fixSteps: [
          'Identify different reasons for change',
          'Extract each reason into separate class',
          'Use composition to connect classes',
          'Apply Single Responsibility Principle'
        ],
        techniques: ['Extract Class', 'Extract Superclass']
      },
      {
        name: 'Shotgun Surgery',
        brief: 'Single change requires many small changes to many classes',
        indicators: [
          'One change affects multiple classes',
          'Related code scattered across classes',
          'Hard to ensure all changes are made'
        ],
        pythonBad: `# BAD: Scattered user validation
class UserService:
    def create_user(self, email):
        if '@' not in email:  # Validation here
            raise ValueError("Invalid email")

class LoginService:
    def login(self, email):
        if '@' not in email:  # Validation duplicated
            raise ValueError("Invalid email")

class PasswordReset:
    def reset(self, email):
        if '@' not in email:  # Validation duplicated
            raise ValueError("Invalid email")`,
        pythonGood: `# GOOD: Centralized validation
class EmailValidator:
    @staticmethod
    def validate(email):
        if '@' not in email:
            raise ValueError("Invalid email")

class UserService:
    def __init__(self, validator):
        self.validator = validator
    
    def create_user(self, email):
        self.validator.validate(email)

class LoginService:
    def __init__(self, validator):
        self.validator = validator`,
        fixSteps: [
          'Identify scattered but related code',
          'Move code to a single location',
          'Create a central class for the concern',
          'Have other classes use the central class'
        ],
        techniques: ['Move Method', 'Move Field', 'Inline Class']
      }
    ],
    dispensables: [
      {
        name: 'Duplicate Code',
        workshop: true,
        sessionCovered: 1,
        brief: 'Same code structure in multiple places',
        indicators: [
          'Identical or very similar code',
          'Copy-paste programming',
          'Logic duplicated with variations'
        ],
        pythonBad: `# BAD: Duplicated validation logic
class UserRegistration:
    def register(self, email, password):
        if not email or '@' not in email:
            raise ValueError("Invalid email")
        if len(password) < 8:
            raise ValueError("Password too short")
        # Registration logic...

class PasswordReset:
    def reset(self, email, new_password):
        if not email or '@' not in email:
            raise ValueError("Invalid email")
        if len(new_password) < 8:
            raise ValueError("Password too short")
        # Reset logic...`,
        pythonGood: `# GOOD: Extracted validation
class Validator:
    @staticmethod
    def validate_email(email):
        if not email or '@' not in email:
            raise ValueError("Invalid email")
    
    @staticmethod
    def validate_password(password):
        if len(password) < 8:
            raise ValueError("Password too short")

class UserRegistration:
    def register(self, email, password):
        Validator.validate_email(email)
        Validator.validate_password(password)
        # Registration logic...

class PasswordReset:
    def reset(self, email, new_password):
        Validator.validate_email(email)
        Validator.validate_password(new_password)
        # Reset logic...`,
        fixSteps: [
          'Identify duplicate code blocks',
          'Extract duplicated code into a method',
          'Replace all occurrences with method call',
          'Consider creating a utility class for shared code'
        ],
        techniques: ['Extract Method', 'Pull Up Method', 'Form Template Method']
      },
      {
        name: 'Dead Code',
        workshop: true,
        sessionCovered: 1,
        brief: 'Code that is never executed or used',
        indicators: [
          'Unreachable code paths',
          'Unused methods or classes',
          'Commented-out code'
        ],
        pythonBad: `# BAD: Dead code everywhere
class UserService:
    def create_user(self, data):
        # Old implementation (commented out)
        # user = {'name': data['name']}
        # save_user_v1(user)
        
        user = {'name': data['name']}
        save_user_v2(user)
    
    def old_validation(self, user):
        # This method is never called
        return user.get('email') is not None`,
        pythonGood: `# GOOD: Only active code
class UserService:
    def create_user(self, data):
        user = {'name': data['name']}
        save_user_v2(user)`,
        fixSteps: [
          'Use code coverage tools to find unused code',
          'Remove commented-out code (use version control)',
          'Delete unused methods and classes',
          'Remove unreachable code paths'
        ],
        techniques: ['Delete the code', 'Inline Method']
      },
      {
        name: 'Speculative Generality',
        workshop: true,
        sessionCovered: 1,
        brief: 'Code created for future needs that never materialize',
        indicators: [
          'Unused abstract classes',
          'Unnecessary delegation',
          'Unused parameters or methods'
        ],
        pythonBad: `# BAD: Over-engineered for future
from abc import ABC, abstractmethod

class DataSource(ABC):
    # Complex abstraction for one implementation
    @abstractmethod
    def connect(self):
        pass
    
    @abstractmethod
    def disconnect(self):
        pass

class DatabaseSource(DataSource):
    def connect(self):
        # Only implementation
        pass
    
    def disconnect(self):
        pass`,
        pythonGood: `# GOOD: Simple and direct
class DatabaseSource:
    def connect(self):
        pass
    
    def disconnect(self):
        pass

# Add abstraction only when second
# implementation is actually needed`,
        fixSteps: [
          'Identify unused abstractions',
          'Remove unnecessary base classes',
          'Collapse hierarchies with single implementation',
          'Remove unused parameters and methods'
        ],
        techniques: ['Collapse Hierarchy', 'Inline Class', 'Remove Parameter']
      }
    ],
    couplers: [
      {
        name: 'Feature Envy',
        workshop: true,
        sessionCovered: 1,
        brief: 'Method uses more data from another class than its own',
        indicators: [
          'Method accesses other object\'s data heavily',
          'Method seems to belong elsewhere',
          'Lots of getter calls to other objects'
        ],
        pythonBad: `# BAD: Feature Envy
class OrderReport:
    def print_total(self, order):
        # Uses order data more than own data
        subtotal = sum(
            item.get_price() * item.get_quantity()
            for item in order.get_items()
        )
        tax = order.get_tax_rate() * subtotal
        return subtotal + tax`,
        pythonGood: `# GOOD: Move method to Order
class Order:
    def calculate_total(self):
        subtotal = sum(
            item.price * item.quantity
            for item in self.items
        )
        tax = self.tax_rate * subtotal
        return subtotal + tax

class OrderReport:
    def print_total(self, order):
        return order.calculate_total()`,
        fixSteps: [
          'Identify which class owns the data',
          'Move the method to that class',
          'Update callers to use new location',
          'Keep data and behavior together'
        ],
        techniques: ['Move Method', 'Extract Method']
      },
      {
        name: 'Message Chains',
        workshop: true,
        sessionCovered: 1,
        brief: 'Client asks one object for another, which asks for another, etc.',
        indicators: [
          'Long chains like a.b().c().d()',
          'Client depends on navigation structure',
          'Changes in chain break many clients'
        ],
        pythonBad: `# BAD: Long message chain
class App:
    def get_user_city(self, user_id):
        user = self.get_user(user_id)
        profile = user.get_profile()
        address = profile.get_address()
        city = address.get_city()
        return city`,
        pythonGood: `# GOOD: Hide delegation
class User:
    def get_city(self):
        return self.profile.address.city

class App:
    def get_user_city(self, user_id):
        user = self.get_user(user_id)
        return user.get_city()`,
        fixSteps: [
          'Identify what the client actually needs',
          'Add method to starting object that provides it',
          'Hide the intermediate chain',
          'Reduce coupling to navigation structure'
        ],
        techniques: ['Hide Delegate', 'Extract Method']
      },
      {
        name: 'Middle Man',
        workshop: true,
        sessionCovered: 1,
        brief: 'Class that does nothing but delegate to another class',
        indicators: [
          'Most methods just delegate',
          'Class adds no value',
          'Unnecessary indirection'
        ],
        pythonBad: `# BAD: Useless middle man
class PersonFacade:
    def __init__(self, person):
        self.person = person
    
    def get_name(self):
        return self.person.get_name()
    
    def get_age(self):
        return self.person.get_age()
    
    def get_email(self):
        return self.person.get_email()`,
        pythonGood: `# GOOD: Use Person directly
class Person:
    def get_name(self):
        return self.name
    
    def get_age(self):
        return self.age
    
    def get_email(self):
        return self.email

# No facade needed - use Person directly`,
        fixSteps: [
          'Identify middle man classes',
          'Have clients call the real object directly',
          'Remove the middle man class',
          'Inline the delegating methods if some are useful'
        ],
        techniques: ['Remove Middle Man', 'Inline Method']
      }
    ]
  },
  lambda: [
    {
      name: 'Lambda Monolith',
      category: 'Bloaters',
      brief: 'Single Lambda function containing too much business logic handling multiple responsibilities',
      indicators: [
        'Function code exceeds 500+ lines',
        'Handles multiple unrelated event types',
        'Long cold start times (>3 seconds)',
        'Difficult to test individual components',
        'Deployment of small change affects all functionality'
      ],
      why: 'In serverless, you pay per execution time and large functions cost more. They also violate the microservices principle and make debugging harder.',
      pythonBad: `# BAD: Monolithic Lambda
import json
import boto3

def lambda_handler(event, context):
    event_type = event.get('type')
    
    if event_type == 'user_registration':
        # 50+ lines of user logic
        user = event['user']
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('Users')
        table.put_item(Item=user)
        ses = boto3.client('ses')
        ses.send_email(...)
        return {'statusCode': 200}
    
    elif event_type == 'order_processing':
        # 60+ lines of order logic
        # ...
        return {'statusCode': 200}
    
    elif event_type == 'inventory_update':
        # 40+ lines of inventory logic
        # ...
        return {'statusCode': 200}`,
      pythonGood: `# GOOD: Separate Lambda functions
# user_registration_lambda.py
import boto3

dynamodb = boto3.resource('dynamodb')
ses = boto3.client('ses')

def lambda_handler(event, context):
    user = event['user']
    table = dynamodb.Table('Users')
    table.put_item(Item=user)
    ses.send_email(...)
    return {'statusCode': 200}

# order_processing_lambda.py
def lambda_handler(event, context):
    # Focused order logic
    return {'statusCode': 200}

# Use EventBridge to route events`,
      fixSteps: [
        'Identify distinct responsibilities in the function',
        'Create separate Lambda function for each responsibility',
        'Use EventBridge or API Gateway to route events',
        'Use Step Functions for workflow orchestration',
        'Share common code via Lambda Layers'
      ]
    },
    {
      name: 'Global Variable Reinitialization',
      category: 'Performance',
      brief: 'Reinitializing expensive resources on every invocation instead of reusing execution context',
      indicators: [
        'Database connections created inside handler',
        'SDK clients initialized in handler',
        'Configuration fetched on every invocation',
        'Higher than expected latency',
        'Unnecessary API calls to SSM/Secrets Manager'
      ],
      why: 'Lambda reuses execution contexts between invocations. Reinitializing resources wastes billable time and increases latency.',
      pythonBad: `# BAD: Reinitializing every time
import json
import boto3

def lambda_handler(event, context):
    # Creating new client EVERY invocation
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Orders')
    
    # Fetching config EVERY invocation
    ssm = boto3.client('ssm')
    response = ssm.get_parameter(Name='/app/config')
    config = json.loads(response['Parameter']['Value'])
    
    # Process order...
    return {'statusCode': 200}`,
      pythonGood: `# GOOD: Initialize outside handler
import json
import boto3

# Initialize ONCE per execution context
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Orders')
ssm = boto3.client('ssm')

# Cache configuration
config = None

def get_config():
    global config
    if config is None:
        response = ssm.get_parameter(Name='/app/config')
        config = json.loads(response['Parameter']['Value'])
    return config

def lambda_handler(event, context):
    # Reuse connections and cached config
    app_config = get_config()
    # Process order...
    return {'statusCode': 200}`,
      fixSteps: [
        'Move SDK client initialization outside handler',
        'Initialize database connections at module level',
        'Cache configuration in global variables',
        'Check if resources exist before creating new ones',
        'Use connection pooling where appropriate'
      ]
    },
    {
      name: 'Synchronous Waiting',
      category: 'Performance',
      brief: 'Lambda function waits synchronously for external operations wasting billable time',
      indicators: [
        'Using time.sleep() or similar blocking calls',
        'Polling for job completion in a loop',
        'Waiting for downstream service responses',
        'High duration for simple operations'
      ],
      why: 'You pay for every millisecond of execution time. Synchronous waiting wastes money and risks timeout.',
      pythonBad: `# BAD: Synchronous polling
import time
import boto3

def lambda_handler(event, context):
    batch = boto3.client('batch')
    
    # Start job
    response = batch.submit_job(...)
    job_id = response['jobId']
    
    # BAD: Poll until complete
    while True:
        status = batch.describe_jobs(jobs=[job_id])
        if status['jobs'][0]['status'] == 'SUCCEEDED':
            break
        time.sleep(5)  # Wasting money!
    
    return {'statusCode': 200}`,
      pythonGood: `# GOOD: Use Step Functions callback
# lambda_start_job.py
import boto3

def lambda_handler(event, context):
    batch = boto3.client('batch')
    
    # Start job with task token from Step Functions
    task_token = event['taskToken']
    response = batch.submit_job(
        jobName='MyJob',
        containerOverrides={
            'environment': [
                {'name': 'TASK_TOKEN', 'value': task_token}
            ]
        }
    )
    
    # Job will call back when complete
    # No polling needed!`,
      fixSteps: [
        'Replace polling with Step Functions callback pattern',
        'Use asynchronous invocations with Destinations',
        'Leverage EventBridge for event-driven coordination',
        'Use DynamoDB Streams for state change notifications',
        'Split long-running operations across multiple functions'
      ]
    },
    {
      name: 'Missing Error Handling',
      category: 'Reliability',
      brief: 'Lambda function without proper error handling and retry logic',
      indicators: [
        'No try-except blocks around external calls',
        'No Dead Letter Queue configured',
        'Silent failures with no logging',
        'No correlation IDs for tracing'
      ],
      why: 'Unhandled errors cause silent failures and make debugging impossible. Lambda auto-retries can cause duplicate processing.',
      pythonBad: `# BAD: No error handling
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Users')
    
    # What if this fails? Silent failure!
    user_id = event['userId']
    table.delete_item(Key={'id': user_id})
    
    # What if SQS is down? Crash!
    sqs = boto3.client('sqs')
    sqs.send_message(...)
    
    return {'statusCode': 200}`,
      pythonGood: `# GOOD: Proper error handling
import json
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')

def lambda_handler(event, context):
    correlation_id = context.request_id
    
    try:
        if 'userId' not in event:
            logger.error("Missing userId", 
                       extra={'correlation_id': correlation_id})
            return {'statusCode': 400}
        
        user_id = event['userId']
        table = dynamodb.Table('Users')
        
        try:
            table.delete_item(Key={'id': user_id})
            logger.info(f"User {user_id} deleted")
        except ClientError as e:
            logger.error(f"DynamoDB error: {e}")
            raise  # Trigger retry/DLQ
        
        return {'statusCode': 200}
        
    except Exception as e:
        logger.exception("Unexpected error")
        raise  # Trigger DLQ`,
      fixSteps: [
        'Wrap external calls in try-except blocks',
        'Configure Dead Letter Queue for failed invocations',
        'Use structured logging with correlation IDs',
        'Implement idempotency for retries',
        'Define custom error types for different scenarios'
      ]
    },
    {
      name: 'Hardcoded Configuration',
      category: 'Configuration',
      brief: 'Configuration values embedded in code instead of using environment variables',
      indicators: [
        'API keys or secrets in code',
        'Database connection strings hardcoded',
        'Environment-specific values in code',
        'Redeployment needed for config changes'
      ],
      why: 'Hardcoded config makes it impossible to deploy the same code to different environments and creates security risks.',
      pythonBad: `# BAD: Hardcoded values
import boto3

def lambda_handler(event, context):
    # Hardcoded API key - SECURITY RISK!
    api_key = "sk-1234567890abcdef"
    
    # Hardcoded table name
    table_name = "prod-users-table"
    
    # Hardcoded bucket
    bucket = "my-app-bucket-prod"
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    return {'statusCode': 200}`,
      pythonGood: `# GOOD: Environment variables & Secrets Manager
import os
import json
import boto3

# Get config from environment
TABLE_NAME = os.environ['TABLE_NAME']
BUCKET_NAME = os.environ['BUCKET_NAME']
SECRET_NAME = os.environ['SECRET_NAME']

secrets_client = boto3.client('secretsmanager')
_secrets = None

def get_secrets():
    global _secrets
    if _secrets is None:
        response = secrets_client.get_secret_value(
            SecretId=SECRET_NAME
        )
        _secrets = json.loads(response['SecretString'])
    return _secrets

def lambda_handler(event, context):
    secrets = get_secrets()
    api_key = secrets['api_key']
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(TABLE_NAME)
    return {'statusCode': 200}`,
      fixSteps: [
        'Move configuration to environment variables',
        'Store secrets in AWS Secrets Manager',
        'Use Systems Manager Parameter Store for config',
        'Cache secrets in global variables',
        'Never commit secrets to version control'
      ]
    },
    {
      name: 'Overprivileged IAM Role',
      category: 'Security',
      brief: 'Lambda execution role with more permissions than necessary',
      indicators: [
        'Using managed policies like AdministratorAccess',
        'Wildcard (*) in actions or resources',
        'Permissions for services not used',
        'Security compliance warnings'
      ],
      why: 'Overprivileged functions increase blast radius of security incidents. Principle of least privilege is critical.',
      pythonBad: `# BAD IAM Policy
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "*",  # Way too broad!
    "Resource": "*"
  }]
}

# Or using AdministratorAccess managed policy`,
      pythonGood: `# GOOD: Least privilege IAM Policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123:table/Users"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123:secret:app/*"
    }
  ]
}`,
      fixSteps: [
        'List all AWS service calls in your function',
        'Grant only specific actions needed',
        'Scope permissions to specific resources (no *)',
        'Use condition keys to further restrict access',
        'Regularly audit and remove unused permissions',
        'Use AWS IAM Access Analyzer'
      ]
    },
    {
      name: 'Stateful Lambda Function',
      category: 'Design',
      brief: 'Lambda function relies on local state between invocations',
      indicators: [
        'Storing state in /tmp without external backup',
        'Relying on global variable state',
        'Race conditions in concurrent executions',
        'Data loss when container is recycled'
      ],
      why: 'Lambda containers are ephemeral and can be recycled at any time. Local state is not guaranteed to persist.',
      pythonBad: `# BAD: Relying on local state

# Global state - not reliable!
request_count = 0
user_cache = {}

def lambda_handler(event, context):
    global request_count, user_cache
    
    # This won't work correctly with
    # concurrent executions
    request_count += 1
    
    # Cache might be lost on cold start
    user_id = event['userId']
    if user_id not in user_cache:
        user_cache[user_id] = fetch_user(user_id)
    
    return {'count': request_count}`,
      pythonGood: `# GOOD: External state management
import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Store counters in DynamoDB
    table = dynamodb.Table('Counters')
    response = table.update_item(
        Key={'id': 'request_count'},
        UpdateExpression='ADD #count :inc',
        ExpressionAttributeNames={'#count': 'count'},
        ExpressionAttributeValues={':inc': 1},
        ReturnValues='UPDATED_NEW'
    )
    
    # Cache in ElastiCache or DynamoDB
    user_id = event['userId']
    cache_table = dynamodb.Table('UserCache')
    user = cache_table.get_item(Key={'id': user_id})
    
    if 'Item' not in user:
        user_data = fetch_user(user_id)
        cache_table.put_item(Item=user_data)
    
    return {'count': response['Attributes']['count']}`,
      fixSteps: [
        'Store persistent state in DynamoDB or S3',
        'Use ElastiCache for frequently accessed data',
        'Design functions to be stateless',
        'Make functions idempotent',
        'Use external services for coordination'
      ]
    },
    {
      name: 'Recursive Invocation',
      category: 'Dangerous',
      brief: 'Lambda function can invoke itself creating potential infinite loops',
      indicators: [
        'Function writes to S3 bucket that triggers it',
        'Function sends messages that re-trigger itself',
        'Unexpected concurrency spikes',
        'Runaway AWS costs'
      ],
      why: 'Recursive invocations can quickly consume all account concurrency and generate massive unexpected costs.',
      pythonBad: `# BAD: Recursive loop risk
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Triggered by S3 PUT events
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Process file...
    processed = process_file(key)
    
    # BAD: Writing to same bucket that triggered us!
    # This will trigger the function again infinitely!
    s3.put_object(
        Bucket=bucket,
        Key=f"processed/{key}",
        Body=processed
    )`,
      pythonGood: `# GOOD: Prevent recursion
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Skip already processed files
    if key.startswith('processed/'):
        return {'statusCode': 200, 'body': 'Already processed'}
    
    processed = process_file(key)
    
    # Write to DIFFERENT bucket
    s3.put_object(
        Bucket='my-output-bucket',  # Different bucket!
        Key=key,
        Body=processed
    )
    
    return {'statusCode': 200}

# Also: Set reserved concurrency limit as safeguard
# Monitor with CloudWatch alarms`,
      fixSteps: [
        'Use naming conventions to identify processed items',
        'Separate input and output resources (buckets, queues)',
        'Add conditional logic to prevent re-triggering',
        'Set reserved concurrency as circuit breaker',
        'Configure CloudWatch alarms for high invocations',
        'Enable recursive loop detection'
      ]
    },
    {
      name: 'Lambda Calling Lambda',
      category: 'Architecture',
      brief: 'Direct synchronous invocations between Lambda functions creating tight coupling',
      indicators: [
        'Using boto3 lambda.invoke() directly',
        'Synchronous request-response pattern',
        'Nested error handling complexity',
        'Timeout propagation issues'
      ],
      why: 'Direct Lambda-to-Lambda calls create tight coupling, make error handling complex, and waste execution time waiting.',
      pythonBad: `# BAD: Direct Lambda invocation
import json
import boto3

lambda_client = boto3.client('lambda')

def lambda_handler(event, context):
    # Process step 1
    result1 = process_step_1(event)
    
    # BAD: Synchronous call to another Lambda
    # We wait (and pay) for the entire duration
    response = lambda_client.invoke(
        FunctionName='process-step-2',
        InvocationType='RequestResponse',
        Payload=json.dumps(result1)
    )
    
    result2 = json.loads(response['Payload'].read())
    
    # Another synchronous call
    response = lambda_client.invoke(
        FunctionName='process-step-3',
        InvocationType='RequestResponse',
        Payload=json.dumps(result2)
    )
    
    return json.loads(response['Payload'].read())`,
      pythonGood: `# GOOD: Decouple with SQS/EventBridge
import json
import boto3

sqs = boto3.client('sqs')

# Function 1: Starts the workflow
def lambda_handler_step1(event, context):
    result = process_step_1(event)
    
    # Send to queue for next step
    sqs.send_message(
        QueueUrl=os.environ['STEP2_QUEUE_URL'],
        MessageBody=json.dumps(result)
    )
    
    return {'statusCode': 200}

# Function 2: Triggered by SQS
def lambda_handler_step2(event, context):
    for record in event['Records']:
        data = json.loads(record['body'])
        result = process_step_2(data)
        
        # Send to next queue
        sqs.send_message(
            QueueUrl=os.environ['STEP3_QUEUE_URL'],
            MessageBody=json.dumps(result)
        )

# Or use Step Functions for orchestration!`,
      fixSteps: [
        'Use SQS queues between functions for buffering',
        'Use EventBridge for event-driven routing',
        'Implement asynchronous invocations with Destinations',
        'Consider Step Functions for complex workflows',
        'Add DLQ for failed processing'
      ]
    },
    {
      name: 'Fat Deployment Package',
      category: 'Performance',
      brief: 'Lambda package includes unnecessary dependencies and files',
      indicators: [
        'Package size over 50MB',
        'Includes entire AWS SDK unnecessarily',
        'Contains test files and docs',
        'Slow cold start times (>2 seconds)'
      ],
      why: 'Large packages increase cold start time and deployment time. You\'re charged for function duration including startup.',
      pythonBad: `# BAD: Import entire libraries
import boto3  # Entire SDK loaded
import pandas  # Massive library
import numpy
import requests
# ... many more

def lambda_handler(event, context):
    # Only using DynamoDB
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Data')
    
    # Only using one pandas function
    df = pandas.DataFrame(data)
    return df.to_dict()

# Package includes:
# - All of boto3 (30MB+)
# - Tests directory
# - Documentation
# - Development dependencies`,
      pythonGood: `# GOOD: Import only what you need
from boto3 import resource

# Use Lambda Layer for heavy dependencies
# like pandas (shared across functions)

dynamodb = resource('dynamodb')

def lambda_handler(event, context):
    table = dynamodb.Table('Data')
    # ... use only DynamoDB
    return {'statusCode': 200}

# requirements.txt for deployment:
# (exclude boto3 - already in Lambda runtime)

# .lambdaignore or deployment script excludes:
# - tests/
# - docs/
# - *.pyc
# - __pycache__/`,
      fixSteps: [
        'Import only specific modules needed',
        'Exclude boto3 (already in Lambda runtime)',
        'Use Lambda Layers for shared dependencies',
        'Exclude test files and docs from package',
        'Minimize transitive dependencies',
        'Use tools like lambda-packager or serverless'
      ]
    }
  ]
};

const refactoringTips = [
  'Always refactor in small, safe steps with tests',
  'Duplicated code is the root of all evil in design',
  'The true test of good code is how easy it is to change',
  'Make it work, make it right, make it fast - in that order',
  'Before you refactor, ensure you have good tests',
  'Code should be optimized for reading, not writing',
  'Small classes and short methods are easier to understand',
  'Functions should do one thing and do it well',
  'Good names eliminate the need for comments',
  'Refactoring should never change external behavior'
];

// State
let currentTab = 'general';
let currentSmell = null;
let learnedSmells = JSON.parse(localStorage.getItem('learnedSmells') || '[]');
let searchTerm = '';

// Initialize app
function init() {
  renderSidebar();
  updateStats();
  setupEventListeners();
  displayRandomTip();
}

// Render sidebar
function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = '';

  if (currentTab === 'general') {
    Object.keys(codeSmells.general).forEach(categoryKey => {
      const category = createCategory(categoryKey, codeSmells.general[categoryKey]);
      nav.appendChild(category);
    });
  } else if (currentTab === 'lambda') {
    const category = createLambdaCategory(codeSmells.lambda);
    nav.appendChild(category);
  } else if (currentTab === 'workshop') {
    renderWorkshopSmells();
    return; // Early return since renderWorkshopSmells handles everything
  }

  // Auto-expand first category
  const firstCategory = nav.querySelector('.category');
  if (firstCategory) {
    firstCategory.classList.add('expanded');
  }
}

// Render workshop smells
function renderWorkshopSmells() {
  const nav = document.getElementById('sidebarNav');

  // Collect all workshop smells
  const workshopSmells = [];

  // From general smells
  Object.values(codeSmells.general).forEach(category => {
    category.forEach(smell => {
      if (smell.workshop) {
        workshopSmells.push(smell);
      }
    });
  });

  // Sort by session and category
  workshopSmells.sort((a, b) => {
    if (a.sessionCovered !== b.sessionCovered) {
      return a.sessionCovered - b.sessionCovered;
    }
    return a.name.localeCompare(b.name);
  });

  // Render
  let html = `
    <div class="category expanded">
      <div class="category-header">
        <div class="category-title">
          <span class="category-toggle">▶</span>
          Session 1 Code Smells
        </div>
        <span class="category-count">${workshopSmells.length}</span>
      </div>
      <ul class="smell-list">
  `;

  workshopSmells.forEach(smell => {
    const isLearned = learnedSmells.includes(smell.name);
    const isActive = currentSmell?.name === smell.name ? 'active' : '';
    const learnedClass = isLearned ? 'learned' : '';
    const learnedCheck = isLearned ? '<span class="learned-check">✓</span>' : '';

    html += `
      <li class="smell-item ${isActive} ${learnedClass}"
          onclick='displaySmell(${JSON.stringify(smell).replace(/'/g, "&#39;")})'>
        ${smell.name}
        ${learnedCheck}
      </li>
    `;
  });

  html += '</ul></div>';
  nav.innerHTML = html;

  // Update total count
  updateStats(workshopSmells.length);

  // Setup category toggle
  const header = nav.querySelector('.category-header');
  if (header) {
    header.onclick = () => {
      nav.querySelector('.category').classList.toggle('expanded');
    };
  }
}

// Create category element
function createCategory(key, smells) {
  const categoryNames = {
    bloaters: 'Bloaters',
    objectOrientationAbusers: 'OO Abusers',
    changePreventers: 'Change Preventers',
    dispensables: 'Dispensables',
    couplers: 'Couplers'
  };

  const div = document.createElement('div');
  div.className = 'category';

  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `
    <div class="category-title">
      <span class="category-toggle">▶</span>
      ${categoryNames[key]}
    </div>
    <span class="category-count">${smells.length}</span>
  `;

  const list = document.createElement('ul');
  list.className = 'smell-list';

  smells.forEach(smell => {
    if (searchTerm && !smell.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return;
    }

    const li = document.createElement('li');
    li.className = 'smell-item';
    li.textContent = smell.name;
    li.onclick = () => displaySmell({ ...smell, category: categoryNames[key] });
    list.appendChild(li);
  });

  header.onclick = () => div.classList.toggle('expanded');
  div.appendChild(header);
  div.appendChild(list);

  return div;
}

// Create Lambda category
function createLambdaCategory(smells) {
  const div = document.createElement('div');
  div.className = 'category expanded';

  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `
    <div class="category-title">
      <span class="category-toggle">▶</span>
      AWS Lambda Smells
    </div>
    <span class="category-count">${smells.length}</span>
  `;

  const list = document.createElement('ul');
  list.className = 'smell-list';

  smells.forEach(smell => {
    if (searchTerm && !smell.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return;
    }

    const li = document.createElement('li');
    li.className = 'smell-item';
    li.textContent = smell.name;
    li.onclick = () => displaySmell(smell);
    list.appendChild(li);
  });

  header.onclick = () => div.classList.toggle('expanded');
  div.appendChild(header);
  div.appendChild(list);

  return div;
}

// Display smell details
function displaySmell(smell) {
  currentSmell = smell;

  // Update UI
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('contentArea').style.display = 'block';

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  }

  // Update active state
  document.querySelectorAll('.smell-item').forEach(item => {
    item.classList.remove('active');
    if (item.textContent === smell.name) {
      item.classList.add('active');
    }
  });

  // Populate content
  document.getElementById('smellTitle').textContent = smell.name;

  // Update badges
  const badgeContainer = document.getElementById('categoryBadge');
  let badgeHTML = `<span class="badge">${smell.category || 'AWS Lambda'}</span>`;
  if (smell.workshop) {
    badgeHTML += '<span class="badge badge--workshop">📚 Session 1</span>';
  }
  badgeContainer.innerHTML = badgeHTML;

  document.getElementById('briefDescription').textContent = smell.brief;

  // Indicators
  const indicatorList = document.getElementById('indicatorList');
  indicatorList.innerHTML = '';
  smell.indicators.forEach(indicator => {
    const li = document.createElement('li');
    li.textContent = indicator;
    indicatorList.appendChild(li);
  });

  // Lambda specific: Why section
  const lambdaWhy = document.getElementById('lambdaWhy');
  if (smell.why) {
    lambdaWhy.style.display = 'block';
    document.getElementById('lambdaWhyContent').textContent = smell.why;
  } else {
    lambdaWhy.style.display = 'none';
  }

  // Code examples
  document.getElementById('badCode').textContent = smell.pythonBad;
  document.getElementById('goodCode').textContent = smell.pythonGood;
  Prism.highlightAll();

  // Fix steps
  const fixSteps = document.getElementById('fixSteps');
  fixSteps.innerHTML = '';
  smell.fixSteps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    fixSteps.appendChild(li);
  });

  // Techniques (only for general smells)
  const techniquesSection = document.getElementById('techniquesSection');
  if (smell.techniques) {
    techniquesSection.style.display = 'block';
    const techniquesList = document.getElementById('techniquesList');
    techniquesList.innerHTML = '';
    smell.techniques.forEach(technique => {
      const span = document.createElement('span');
      span.className = 'technique-badge';
      span.textContent = technique;
      techniquesList.appendChild(span);
    });
  } else {
    techniquesSection.style.display = 'none';
  }

  // Learned checkbox
  const checkbox = document.getElementById('learnedCheckbox');
  checkbox.checked = learnedSmells.includes(smell.name);

  // Share button
  const shareBtn = document.getElementById('shareBtn');
  shareBtn.onclick = () => {
    const url = `${window.location.origin}${window.location.pathname}#${smell.name.toLowerCase().replace(/\s+/g, '-')}`;

    if (navigator.share) {
      navigator.share({
        title: `Code Smell: ${smell.name}`,
        text: smell.brief,
        url: url
      }).catch(err => {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '✓ Link Copied!';
        setTimeout(() => {
          shareBtn.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        alert('Failed to copy link. Please copy manually: ' + url);
      });
    }
  };

  // Scroll to top
  document.querySelector('.main-content').scrollTop = 0;
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      searchTerm = '';
      document.getElementById('searchInput').value = '';
      renderSidebar();
    });
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderSidebar();
  });

  // Random button
  document.getElementById('randomBtn').addEventListener('click', showRandomSmell);

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const code = document.getElementById(targetId).textContent;
      navigator.clipboard.writeText(code).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '✓ Copied!';
        this.classList.add('copied');
        setTimeout(() => {
          this.innerHTML = originalText;
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // Learned checkbox
  document.getElementById('learnedCheckbox').addEventListener('change', (e) => {
    if (e.target.checked) {
      if (!learnedSmells.includes(currentSmell.name)) {
        learnedSmells.push(currentSmell.name);
      }
    } else {
      learnedSmells = learnedSmells.filter(name => name !== currentSmell.name);
    }

    // Save to localStorage
    localStorage.setItem('learnedSmells', JSON.stringify(learnedSmells));

    updateStats();
    renderSidebar(); // Re-render to show learned checkmarks
  });

  // Hamburger menu
  document.getElementById('hamburger').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('active');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');

    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !hamburger.contains(e.target)) {
      sidebar.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

  // Reset progress button
  document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
    if (confirm('Clear all learned smells? This cannot be undone.')) {
      learnedSmells = [];
      localStorage.removeItem('learnedSmells');
      renderSidebar();
      updateStats();
      if (currentSmell) {
        displaySmell(currentSmell);
      }
    }
  });
}

// Show random smell
function showRandomSmell() {
  let allSmells = [];
  
  if (currentTab === 'general') {
    Object.values(codeSmells.general).forEach(category => {
      allSmells = allSmells.concat(category);
    });
    const randomSmell = allSmells[Math.floor(Math.random() * allSmells.length)];
    displaySmell({ ...randomSmell, category: 'Random' });
  } else {
    const randomSmell = codeSmells.lambda[Math.floor(Math.random() * codeSmells.lambda.length)];
    displaySmell(randomSmell);
  }
}

// Update stats
function updateStats(customTotal) {
  let total = customTotal;

  if (customTotal === undefined) {
    total = 0;
    if (currentTab === 'general') {
      Object.values(codeSmells.general).forEach(category => {
        total += category.length;
      });
    } else if (currentTab === 'lambda') {
      total = codeSmells.lambda.length;
    } else if (currentTab === 'workshop') {
      // Count workshop smells
      Object.values(codeSmells.general).forEach(category => {
        category.forEach(smell => {
          if (smell.workshop) total++;
        });
      });
    }
  }

  document.getElementById('totalSmells').textContent = total;
  document.getElementById('learnedCount').textContent = learnedSmells.length;
}

// Display random tip
function displayRandomTip() {
  const tip = refactoringTips[Math.floor(Math.random() * refactoringTips.length)];
  document.getElementById('randomTip').textContent = tip;
}

// Welcome modal functions
function showWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  const dontShowAgain = document.getElementById('dontShowAgain').checked;

  if (dontShowAgain) {
    localStorage.setItem('welcomeModalSeen', 'true');
  }

  modal.classList.remove('show');
}

// Show modal on first visit
window.addEventListener('load', () => {
  const hasSeenModal = localStorage.getItem('welcomeModalSeen');
  if (!hasSeenModal) {
    setTimeout(showWelcomeModal, 500);
  }
});

// Close modal on background click
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('welcomeModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'welcomeModal') {
      closeWelcomeModal();
    }
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Random smell: R key
  if (e.key === 'r' || e.key === 'R') {
    if (!e.target.matches('input, textarea')) {
      document.getElementById('randomBtn').click();
    }
  }

  // Search: / key
  if (e.key === '/') {
    if (!e.target.matches('input, textarea')) {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  }

  // Mark as learned: L key
  if (e.key === 'l' || e.key === 'L') {
    if (!e.target.matches('input, textarea') && currentSmell) {
      const checkbox = document.getElementById('learnedCheckbox');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  }
});

// Handle URL hash on load
window.addEventListener('load', () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const smellName = hash.replace(/-/g, ' ');
    // Find and display the smell
    let found = false;

    // Search in general smells
    Object.values(codeSmells.general).forEach(category => {
      const smell = category.find(s =>
        s.name.toLowerCase() === smellName.toLowerCase()
      );
      if (smell && !found) {
        displaySmell(smell);
        found = true;
      }
    });

    // Search in lambda smells if not found
    if (!found) {
      const smell = codeSmells.lambda.find(s =>
        s.name.toLowerCase() === smellName.toLowerCase()
      );
      if (smell) {
        displaySmell(smell);
      }
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}