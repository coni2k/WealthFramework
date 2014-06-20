//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BusinessObjects.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class UserResourcePoolIndexDto
    {
        public UserResourcePoolIndexDto()
        {
        }

        public UserResourcePoolIndexDto(UserResourcePoolIndex userResourcePoolIndex)
        {
            this.Id = userResourcePoolIndex.Id;
            this.UserResourcePoolId = userResourcePoolIndex.UserResourcePoolId;
            this.ResourcePoolIndexId = userResourcePoolIndex.ResourcePoolIndexId;
            this.Rating = userResourcePoolIndex.Rating;
            this.CreatedOn = userResourcePoolIndex.CreatedOn;
            this.ModifiedOn = userResourcePoolIndex.ModifiedOn;
            this.DeletedOn = userResourcePoolIndex.DeletedOn;
            this.RowVersion = userResourcePoolIndex.RowVersion;
        }

        [Required]
        public int Id { get; set; }

        [Required]
        public int UserResourcePoolId { get; set; }

        [Required]
        public int ResourcePoolIndexId { get; set; }

        [Required]
        public decimal Rating { get; set; }

        [Required]
        public System.DateTime CreatedOn { get; set; }

        [Required]
        public System.DateTime ModifiedOn { get; set; }

        public Nullable<System.DateTime> DeletedOn { get; set; }

        [Required]
        public byte[] RowVersion { get; set; }

        public UserResourcePoolIndex ToBusinessObject()
        {
            return new UserResourcePoolIndex()
            {
                Id = Id,
                UserResourcePoolId = UserResourcePoolId,
                ResourcePoolIndexId = ResourcePoolIndexId,
                Rating = Rating,
                CreatedOn = CreatedOn,
                ModifiedOn = ModifiedOn,
                DeletedOn = DeletedOn,
                RowVersion = RowVersion
            };
        }
    }
}
