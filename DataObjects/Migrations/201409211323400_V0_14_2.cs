namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ElementField",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ElementId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        ElementFieldType = c.Byte(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId, cascadeDelete: true)
                .Index(t => t.ElementId);
            
            CreateTable(
                "dbo.ElementItemElementField",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ElementItemId = c.Int(nullable: false),
                        ElementFieldId = c.Int(nullable: false),
                        StringValue = c.String(),
                        BooleanValue = c.Boolean(),
                        IntegerValue = c.Int(),
                        DecimalValue = c.Decimal(precision: 18, scale: 2),
                        DateTimeValue = c.DateTime(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementField", t => t.ElementFieldId, cascadeDelete: false)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: true)
                .Index(t => new { t.ElementItemId, t.ElementFieldId }, unique: true, name: "IX_ElementItemIdElementFieldId");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ElementItemElementField", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItemElementField", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.ElementField", "ElementId", "dbo.Element");
            DropIndex("dbo.ElementItemElementField", "IX_ElementItemIdElementFieldId");
            DropIndex("dbo.ElementField", new[] { "ElementId" });
            DropTable("dbo.ElementItemElementField");
            DropTable("dbo.ElementField");
        }
    }
}